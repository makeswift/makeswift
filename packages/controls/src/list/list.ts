import { z } from 'zod'

// import { MappedResolvableValue } from '../resource-resolver'
import { type CopyContext } from '../context'
// import {
//   type ResourceResolver,
// } from '../resource-resolver'

import { type SendType } from '../control-instance'

import {
  ControlDefinition,
  safeParse,
  serialize,
  type Schema,
  type ParseResult,
  type DataType as DataType_,
  type ValueType as ValueType_,
  type ResolvedValueType as ResolvedValueType_,
} from '../control-definition'

import { notNil, keyNotNil } from '../utils/functional'

import { ListControl } from './list-control'

type Config<Item extends ControlDefinition = ControlDefinition> = {
  type: Item
  label?: string
  getItemLabel?(item: DataType_<Item> | undefined): string
}

type ItemType<C extends Config> = C extends Config<infer Item> ? Item : never
type DataType<C extends Config> = {
  id: string
  type?: string
  value: DataType_<ItemType<C>>
}[]

type ValueType<C extends Config> = ValueType_<ItemType<C>>[]
type ResolvedValueType<C extends Config> = ResolvedValueType_<ItemType<C>>[]

class Definition<C extends Config = Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>,
  ListControl<Definition<C>>
> {
  static readonly type = 'makeswift::controls::list' as const

  constructor(readonly config: C) {
    super(config)
  }

  get itemDef() {
    return this.config.type
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    const type = z.literal(Definition.type)
    const item = this.itemDef.schema

    const data = z.array(
      z.object({
        id: z.string(),
        type: item.type.optional(),
        value: item.data,
      }),
    ) as Schema<DataType<C> | undefined>

    const value = z.array(item.value)
    const resolvedValue = z.array(item.resolvedValue).optional()

    const config = z.object({
      type: item.definition,
      label: z.string().optional(),
      getItemLabel: z.function().optional(),
    })

    const definition = z.object({
      type,
      config,
    })

    return { type, data, value, resolvedValue, config, definition }
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    return data?.map(({ value }) => this.itemDef.fromData(value)).filter(notNil)
  }

  toData(value: ValueType<C>): DataType<C> {
    return value.map((value, index) => ({
      id: `${index}`,
      type: this.itemDef.controlType,
      value: this.itemDef.toData(value),
    }))
  }

  copyData(
    data: DataType<C> | undefined,
    context: CopyContext,
  ): DataType<C> | undefined {
    return data
      ?.map((item) => ({
        ...item,
        value: this.itemDef.copyData(item.value, context),
      }))
      .filter((data) => keyNotNil(data, 'value'))
  }

  // resolveValue(
  //   value: ValueType<C>,
  //   resolver: ResourceResolver,
  // ): ResolvableValue<ResolvedValueType<C>> {
  //   const resolved = value?.map((value) =>
  //     this.itemDef.resolveValue(value, resolver),
  //   )

  //   return new MappedResolvableValue(
  //     () => resolved?.map((r) => r.readValue()).filter(notNil),
  //     (_onUpdate: () => void) => () => {}, // FIXME: implement
  //     (value: ResolvedValueType<C>) => value,
  //   )
  // }

  createInstance(
    send: SendType<ListControl<Definition<C>>>,
  ): ListControl<Definition<C>> {
    return new ListControl(this, send)
  }

  serialize(): [unknown, Transferable[]] {
    // FIXME: implement
    return serialize(this.config, {
      type: Definition.type,
    })
  }

  getSwatchIds(data: DataType<C> | undefined): string[] {
    return data?.flatMap((item) => this.itemDef.getSwatchIds(item.value)) ?? []
  }

  // introspect<R extends Resource>(
  //   data: DataType<C> | undefined,
  //   r: R,
  // ): ReturnType<R['introspect']> {
  //   return data?.flatMap((item) => this.itemDef.introspect(item.value, r)) ?? []
  // }
}

export const List = <C extends Config>(config: C) =>
  new (class List extends Definition<C> {})(config)

export { Definition as ListDefinition }
