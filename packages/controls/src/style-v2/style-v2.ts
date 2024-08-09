import { z } from 'zod'

import { type ResponsiveValue } from '../common'

import { responsiveValue } from '../common/schema'

import { type CopyContext } from '../context'
import { type IntrospectionTarget } from '../introspect'
import { type SendMessage } from '../control-instance'
import { type ResourceResolver } from '../resource-resolver'
import { type Effector } from '../effector'

import {
  ControlDefinition,
  safeParse,
  serialize,
  type ResolvedValueType as ResolvedValueType_,
  type SchemaType as SchemaType_,
  type DataType as DataType_,
  type ValueType as ValueType_,
  type Resolvable,
  type ParseResult,
  type SerializedRecord,
} from '../control-definition'

import { StyleV2Control } from './style-v2-control'

type PropDefinition = ControlDefinition<string, unknown, any, any, any>

type Config<
  Prop extends PropDefinition = PropDefinition,
  RuntimeStylesObject = unknown,
> = {
  type: Prop
  getStyle: (item: ResolvedValueType_<Prop> | undefined) => RuntimeStylesObject
}

type SchemaType<_Prop extends PropDefinition> = typeof Definition.baseSchema

type DataType<Prop extends PropDefinition> = ResponsiveValue<DataType_<Prop>>
type ValueType<Prop extends PropDefinition> = ResponsiveValue<ValueType_<Prop>>
type ResolvedValueType<Prop extends PropDefinition> = z.infer<
  SchemaType<Prop>['resolvedValue']
>

type InstanceType<_Prop extends PropDefinition> = StyleV2Control

class Definition<
  Prop extends PropDefinition,
  RuntimeStylesObject,
> extends ControlDefinition<
  typeof Definition.type,
  Config<Prop, RuntimeStylesObject>,
  DataType<Prop>,
  ValueType<Prop>,
  ResolvedValueType<Prop>,
  InstanceType<Prop>
> {
  static readonly type = 'makeswift::controls::style-v2' as const

  static get baseSchema() {
    const type = z.literal(Definition.type)
    const resolvedValue = z.string()

    return {
      type,
      resolvedValue,
    }
  }

  static schema<T>({ typeDef }: { typeDef: SchemaType_<T> }) {
    const config = z.object({
      type: typeDef,
      getStyle: z.function().args(z.any()).returns(z.any()),
    })

    const { type, resolvedValue } = Definition.baseSchema
    const definition = z.object({
      type,
      config,
    })

    return {
      definition,
      type,
      config,
      resolvedValue,
    }
  }

  static deserialize(
    data: SerializedRecord,
    deserializeCallback: (r: SerializedRecord) => ControlDefinition,
  ) {
    if (data.type !== Definition.type) {
      throw new Error(
        `StyleV2: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const {
      config: { type, ...config },
    } = Definition.schema({ typeDef: z.any() }).definition.parse(data)

    const typeDef = deserializeCallback(type)

    return new Definition({ type: typeDef, ...config })
  }

  get typeDef() {
    return this.config.type
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    const typeDef = this.typeDef.schema

    const data = responsiveValue(typeDef.data) as SchemaType_<DataType<Prop>>
    const value = responsiveValue(typeDef.value) as SchemaType_<ValueType<Prop>>

    return {
      ...Definition.schema({ typeDef: typeDef.definition }),
      data,
      value,
    }
  }

  safeParse(
    data: unknown | undefined,
  ): ParseResult<DataType<Prop> | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType<Prop> | undefined): ValueType<Prop> | undefined {
    return data?.map((item) => ({
      ...item,
      value: this.typeDef.fromData(item.value),
    }))
  }

  toData(value: ValueType<Prop>): DataType<Prop> {
    return (
      value?.map((item) => ({
        ...item,
        value: this.typeDef.toData(item.value),
      })) ?? []
    )
  }

  resolveValue(
    data: DataType<Prop> | undefined,
    resolver: ResourceResolver,
    effector: Effector,
    control?: InstanceType<Prop>,
  ): Resolvable<ResolvedValueType<Prop> | undefined> {
    const responsiveValues = Object.fromEntries(
      data?.map(({ deviceId, value }) => [
        deviceId,
        this.typeDef.resolveValue(
          value,
          resolver,
          effector,
          control?.propControl,
        ),
      ]) ?? [],
    )

    return {
      readStableValue: (previous?: ResolvedValueType<Prop>) => {
        // FIXME
        return previous
      },

      subscribe: (onUpdate: () => void) => {
        const unsubscribes = Object.entries(responsiveValues).map(([, item]) =>
          item.subscribe(onUpdate),
        )
        return () => unsubscribes?.forEach((u) => u())
      },

      triggerResolve: async (currentValue: ResolvedValueType<Prop>) => {
        const subResolves =
          Object.values(responsiveValues).map((item) =>
            item.triggerResolve(currentValue),
          ) ?? []

        await Promise.all([...subResolves])
      },
    }
  }

  copyData(
    data: DataType<Prop> | undefined,
    context: CopyContext,
  ): DataType<Prop> | undefined {
    if (data == null) return data

    return data.map((item) => ({
      ...item,
      value: this.typeDef.copyData(item.value, context),
    }))
  }

  createInstance(sendMessage: SendMessage) {
    return new StyleV2Control(this.typeDef, sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
  }

  introspect<R>(
    data: DataType<Prop> | undefined,
    target: IntrospectionTarget<R>,
  ) {
    if (data == null) return []

    return data.flatMap((item) => this.typeDef.introspect(item.value, target))
  }
}

export {
  Definition as StyleV2Definition,
  type Config as StyleV2Config,
  type PropDefinition as StyleV2PropDefinition,
}
