import { z } from 'zod'

import { type ResponsiveValue } from '../common'

import { responsiveValue } from '../common/schema'

import { type CopyContext } from '../context'
import { type IntrospectionTarget } from '../introspect'
import { type SendMessage } from '../control-instance'

import {
  ControlDefinition,
  safeParse,
  serialize,
  type ResolvedValueType as ResolvedValueType_,
  type SchemaType as SchemaType_,
  type DataType as DataType_,
  type ValueType as ValueType_,
  type ParseResult,
  type SerializedRecord,
} from '../control-definition'

import { StyleV2Control } from './style-v2-control'

type ItemDefinition = ControlDefinition<string, unknown, any, any, any>

type Config<Item extends ItemDefinition = ItemDefinition> = {
  type: Item
  // TODO: implement
  getStyle: (item?: ResolvedValueType_<Item>) => any
}

type ItemType<C extends Config> = C extends Config<infer Item> ? Item : never
type DataType<C extends Config> = ResponsiveValue<DataType_<ItemType<C>>>
type ValueType<C extends Config> = ResponsiveValue<ValueType_<ItemType<C>>>
type ControlType<RuntimeStylesObject, C extends Config> = StyleV2Control<
  RuntimeStylesObject,
  Definition<RuntimeStylesObject, C>
>

abstract class Definition<
  RuntimeStylesObject,
  C extends Config = Config,
> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResponsiveValue<RuntimeStylesObject>,
  ControlType<RuntimeStylesObject, C>
> {
  static readonly type = 'makeswift::controls::style-v2' as const

  constructor(readonly config: C) {
    super(config)
  }

  static schema<T>({ typeDef }: { typeDef: SchemaType_<T> }) {
    const type = z.literal(Definition.type)
    const config = z.object({
      type: typeDef,
      getStyle: z.function().args(z.any()).returns(z.any()),
    })

    const definition = z.object({
      type,
      config,
    })

    return {
      type,
      config,
      definition,
    }
  }

  get typeDef() {
    return this.config.type
  }

  get controlType() {
    return Definition.type
  }

  get resolvedSchema(): SchemaType_<ResponsiveValue<RuntimeStylesObject>> {
    return z.any()
  }

  get schema() {
    const type = this.typeDef.schema

    const data = responsiveValue(type.value) as SchemaType_<DataType<C>>
    const value = responsiveValue(type.value) as SchemaType_<ValueType<C>>

    return {
      ...Definition.schema({ typeDef: type.definition }),
      data,
      value,
      resolvedValue: this.resolvedSchema,
    }
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    return data?.map((item) => ({
      ...item,
      value: this.typeDef.fromData(item.value),
    }))
  }

  toData(value: ValueType<C>): DataType<C> {
    return (
      value?.map((item) => ({
        ...item,
        value: this.typeDef.toData(item.value),
      })) ?? []
    )
  }

  copyData(
    data: DataType<C> | undefined,
    context: CopyContext,
  ): DataType<C> | undefined {
    if (data == null) return data

    return data.map((item) => ({
      ...item,
      value: this.typeDef.copyData(item.value, context),
    }))
  }

  createInstance(sendMessage: SendMessage<any>) {
    return new StyleV2Control(this, sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
  }

  introspect<R>(data: DataType<C> | undefined, target: IntrospectionTarget<R>) {
    if (data == null) return []

    return data.flatMap((item) => this.typeDef.introspect(item.value, target))
  }
}

export { Definition as StyleV2Definition }
