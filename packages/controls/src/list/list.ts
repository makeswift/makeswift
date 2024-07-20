import { z } from 'zod'
import { v4 as uuid } from 'uuid'

import { MergeTranslatableDataContext, type CopyContext } from '../context'
import {
  type ResourceResolver,
  type ValueSubscription,
} from '../resource-resolver'

import { type SendMessage } from '../control-instance'

import { type Effector } from '../effector'

import {
  ControlDefinition,
  safeParse,
  serialize,
  type SchemaType,
  type ParseResult,
  type SerializedRecord,
  type DataType as DataType_,
  type ValueType as ValueType_,
  type SchemaType as SchemaType_,
  type ResolvedValueType as ResolvedValueType_,
} from '../control-definition'

import { arraysAreEqual } from '../utils/functional'

import { ListControl } from './list-control'
import { type IntrospectionTarget } from '../introspect'
import { type Deserialized } from '../serialization'
import { Data } from '../common'

type ItemLabelType<Item extends ControlDefinition> = (
  item: ResolvedValueType_<Item>,
) => string | Promise<string>

type Config<
  Item extends ControlDefinition = ControlDefinition,
  ItemLabel extends ItemLabelType<Item> = ItemLabelType<Item>,
> = {
  type: Item
  label?: string
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
type ControlType<C extends Config> = ListControl<Definition<C>>

type SchemaReturnType<C extends Config> = {
  definition: SchemaType_<unknown>
  type: SchemaType_<typeof Definition.type>
  data: SchemaType_<DataType<C> | undefined>
  value: SchemaType_<ValueType<C> | undefined>
  resolvedValue: SchemaType_<ResolvedValueType<C> | undefined>
}

class Definition<C extends Config = Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>,
  ControlType<C>
> {
  static readonly type = 'makeswift::controls::list' as const

  static schema<T>({ itemDef }: { itemDef: SchemaType<T> }) {
    const type = z.literal(Definition.type)
    const config = z.object({
      type: itemDef,
      label: z.string().optional(),
      getItemLabel: z.function().args(z.any()).returns(z.any()).optional(),
    })

    const definition = z.object({
      type,
      config,
    })

    return { type, config, definition }
  }

  static deserialize(
    data: SerializedRecord,
    deserializeCallback: (r: SerializedRecord) => ControlDefinition,
  ) {
    if (data.type !== Definition.type)
      throw new Error(`List: expected '${Definition.type}', got '${data.type}'`)

    const {
      config: { type, ...config },
    } = this.schema({ itemDef: z.any() }).definition.parse(data)

    const itemDef = deserializeCallback(type)
    return new Definition<Deserialized<Config>>({ type: itemDef, ...config })
  }

  constructor(readonly config: C) {
    super(config)
  }

  get itemDef() {
    return this.config.type
  }

  get controlType() {
    return Definition.type
  }

  get refinedSchema() {
    const item = this.itemDef.schema

    const data = z.array(
      z.object({
        id: z.string(),
        type: item.type.optional(),
        value: item.data,
      }),
    ) as SchemaType<DataType<C> | undefined>

    const value = z.array(item.value)
    const resolvedValue = z.array(item.resolvedValue)

    return {
      ...Definition.schema({ itemDef: item.definition }),
      data,
      value,
      resolvedValue,
    }
  }

  // See Image control for explanation
  get schema(): SchemaReturnType<C> {
    return this.refinedSchema
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.refinedSchema.data, data)
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

  resolveValue(
    data: DataType<C> | undefined,
    resolver: ResourceResolver,
    effector: Effector,
    control?: ControlType<C>,
  ): ValueSubscription<ResolvedValueType<C> | undefined> {
    const emptyList: ResolvedValueType<C> = []

    const childControls = control?.childControls(data?.map(({ id }) => id))
    if (childControls) {
      effector.queueEffect(() => control?.setChildControls(childControls))
    }

    const itemValues = data?.map(({ value, id }) =>
      this.itemDef.resolveValue(
        value,
        resolver,
        effector,
        childControls?.get(id),
      ),
    )

    return {
      readStableValue: (previous?: ResolvedValueType<C>) => {
        const r = itemValues?.map((v, i) => v.readStableValue(previous?.[i]))
        return (arraysAreEqual(r, previous) ? previous : r) ?? emptyList
      },

      subscribe: (onUpdate: () => void) => {
        const unsubscribes = itemValues?.map((v) => v.subscribe(onUpdate))
        return () => unsubscribes?.forEach((u) => u())
      },
    }
  }

  createInstance(sendMessage: SendMessage<any>): ControlType<C> {
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
    data: DataType<C>,
    translatedData: Record<string, DataType<C>>,
    context: MergeTranslatableDataContext,
  ): Data {
    if (translatedData == null) return data
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
}

export const List = <
  Item extends ControlDefinition,
  ItemLabel extends ItemLabelType<Item>,
>(
  config: Config<Item, ItemLabel>,
) => new (class List extends Definition<Config<Item, ItemLabel>> {})(config)

export { Definition as ListDefinition }
