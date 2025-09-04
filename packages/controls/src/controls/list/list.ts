import { v4 as uuid } from 'uuid'
import { z } from 'zod'

import { Effects } from '../../lib/effects'
import { StableValue } from '../../lib/stable-value'
import { safeParse, type ParseResult } from '../../lib/zod'

import { type Data } from '../../common'
import {
  type CopyContext,
  type MergeTranslatableDataContext,
} from '../../context'
import { type IntrospectionTarget } from '../../introspection'
import { type ResourceResolver } from '../../resources/resolver'
import {
  SerializationSchema,
  type DeserializedRecord,
  type SerializedRecord,
} from '../../serialization'
import { type Stylesheet } from '../../stylesheet'

import {
  type DataType as DataType_,
  type ResolvedValueType as ResolvedValueType_,
  type ValueType as ValueType_,
} from '../associated-types'
import {
  ControlDefinition,
  serialize,
  type Resolvable,
  type SchemaType,
  type SchemaTypeAny,
} from '../definition'
import { type SendMessage } from '../instance'

import { ListControl } from './list-control'

type ItemDefinition = ControlDefinition<string, unknown, any, any, any>

/**
 * TODO: This type defines the signature of the `getItemLabel` config option. We
 * eventually want this function to operate on the resolved value of the item.
 * Once render hook is removed, we can change the item type to be
 * ResolvedValueType_<Item> instead of ValueType_<Item>.
 */
type ItemLabelType<Item extends ItemDefinition> = (
  item?: ValueType_<Item>,
) => string | Promise<string>

type Config<
  Item extends ItemDefinition = ItemDefinition,
  ItemLabel extends ItemLabelType<Item> = ItemLabelType<Item>,
> = {
  type: Item
  label?: string
  description?: string
  getItemLabel?: ItemLabel
}

type ItemType<C extends Config> = C extends Config<infer Item> ? Item : never
type DataType<C extends Config> = {
  id: string
  type?: string
  value: DataType_<ItemType<C>>
}[]

type ValueType<C extends Config> = ValueType_<ItemType<C>>[]
type ResolvedValueType<C extends Config> = ResolvedValueType_<ItemType<C>>[]
type InstanceType<C extends Config> = ListControl<Definition<C>>

class Definition<C extends Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>,
  InstanceType<C>
> {
  static readonly type = 'makeswift::controls::list' as const

  static schema<S extends SchemaTypeAny>({ itemDef }: { itemDef: S }) {
    const type = z.literal(Definition.type)
    const config = z.object({
      type: itemDef,
      label: z.string().optional(),
      description: z.string().optional(),
      getItemLabel: z.function().args(z.any()).returns(z.any()).optional(),
    })

    const definition = z.object({
      type,
      config,
    })

    return { type, config, definition }
  }

  static deserialize(
    data: DeserializedRecord,
    deserializeCallback: (r: DeserializedRecord) => ControlDefinition,
  ): ListDefinition {
    if (data.type !== Definition.type)
      throw new Error(`List: expected '${Definition.type}', got '${data.type}'`)

    const {
      config: { type, ...config },
    } = this.schema({
      itemDef: SerializationSchema.deserializedRecord,
    }).definition.parse(data)

    const itemDef = deserializeCallback(type)
    return new ListDefinition({ ...config, type: itemDef })
  }

  get itemDef() {
    return this.config.type
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    const item = this.itemDef.schema

    const data = z.array(
      z.object({
        id: z.string(),
        type: item.type.optional(),
        value: item.data,
      }),
    ) as SchemaType<DataType<C>>

    const value = z.array(item.value) as SchemaType<ValueType<C>>
    const resolvedValue = z.array(item.resolvedValue) as SchemaType<
      ResolvedValueType<C>
    >

    return {
      ...Definition.schema({ itemDef: item.definition }),
      data,
      value,
      resolvedValue,
    }
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    return data?.map(({ value }) => this.itemDef.fromData(value))
  }

  toData(value: ValueType<C>): DataType<C> {
    return value.map((value) => ({
      id: uuid(),
      type: this.itemDef.controlType,
      value: this.itemDef.toData(value),
    }))
  }

  copyData(
    data: DataType<C> | undefined,
    context: CopyContext,
  ): DataType<C> | undefined {
    return data?.map((item) => ({
      ...item,
      value: this.itemDef.copyData(item.value, context),
    }))
  }

  getTranslatableData(data: DataType<C>): Data {
    if (data == null) return null
    return Object.fromEntries(
      data.map((item) => [
        item.id,
        this.itemDef.getTranslatableData(item.value),
      ]),
    )
  }

  mergeTranslatedData(
    data: DataType<C> | undefined,
    translatedData: Record<string, DataType<C>>,
    context: MergeTranslatableDataContext,
  ): Data {
    if (data == null || translatedData == null) return data
    return data.map((item) => {
      return {
        ...item,
        value: this.itemDef.mergeTranslatedData(
          item.value,
          translatedData[item.id],
          context,
        ),
      }
    })
  }

  resolveValue(
    data: DataType<C> | undefined,
    resolver: ResourceResolver,
    stylesheet: Stylesheet,
    control?: InstanceType<C>,
  ): Resolvable<ResolvedValueType<C> | undefined> {
    const effects = new Effects()

    const childControls = control?.childControls(data?.map(({ id }) => id))
    if (childControls) {
      effects.add(() => control?.setChildControls(childControls))
    }

    const itemValues = data?.map(({ value, id }) =>
      this.itemDef.resolveValue(
        value,
        resolver,
        stylesheet.child(id),
        childControls?.get(id),
      ),
    )

    const stableValue = StableValue({
      name: Definition.type,
      read: () => itemValues?.map((v) => v.readStable()) ?? [],
      deps: itemValues,
    })

    return {
      ...stableValue,
      triggerResolve: async (currentValue?: ResolvedValueType<C>) => {
        await Promise.all([
          effects.run(),
          ...(itemValues?.map((v, i) => v.triggerResolve(currentValue?.[i])) ??
            []),
        ])
      },
    }
  }

  createInstance(sendMessage: SendMessage<any>): InstanceType<C> {
    return new ListControl(this, sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
  }

  introspect<R>(data: DataType<C> | undefined, target: IntrospectionTarget<R>) {
    return (
      data?.flatMap((item) => this.itemDef.introspect(item.value, target)) ?? []
    )
  }
}

export class ListDefinition<C extends Config = Config> extends Definition<C> {}

export function List<
  Item extends ItemDefinition,
  ItemLabel extends ItemLabelType<Item>,
>(config: Config<Item, ItemLabel>): ListDefinition<Config<Item, ItemLabel>> {
  return new ListDefinition<Config<Item, ItemLabel>>(config)
}
