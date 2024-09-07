import { z } from 'zod'

import { StableValue } from '../../lib/stable-value'
import { safeParse, type ParseResult } from '../../lib/zod'

import {
  findBreakpointOverride,
  mergeOrCoalesceFallbacks,
  type Breakpoint,
} from '../../breakpoints'
import { type ResponsiveValue } from '../../common'
import { responsiveValue } from '../../common/schema'
import { type CopyContext } from '../../context'
import { type IntrospectionTarget } from '../../introspection'
import { type ResourceResolver } from '../../resources/resolver'
import { type SerializedRecord } from '../../serialization'
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

import { StyleV2Control } from './style-v2-control'

type PropDefinition = ControlDefinition<string, unknown, any, any, any>

type Config<
  Prop extends PropDefinition = PropDefinition,
  RuntimeStylesObject = unknown,
> = {
  type: Prop
  getStyle: (item: ResolvedValueType_<Prop> | undefined) => RuntimeStylesObject
}

type Schema<_Prop extends PropDefinition> = typeof Definition.baseSchema

type DataType<Prop extends PropDefinition> = ResponsiveValue<DataType_<Prop>>
type ValueType<Prop extends PropDefinition> = ResponsiveValue<ValueType_<Prop>>
type ResolvedValueType<Prop extends PropDefinition> = z.infer<
  Schema<Prop>['resolvedValue']
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

  static schema<S extends SchemaTypeAny>({ typeDef }: { typeDef: S }) {
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

  get typeDef() {
    return this.config.type
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    const typeDef = this.typeDef.schema

    const data = responsiveValue(typeDef.data) as SchemaType<DataType<Prop>>
    const value = responsiveValue(typeDef.value) as SchemaType<ValueType<Prop>>

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
    stylesheet: Stylesheet,
    control?: InstanceType<Prop>,
  ): Resolvable<ResolvedValueType<Prop> | undefined> {
    const responsiveValues = (data ?? []).map(({ deviceId, value }) => ({
      deviceId,
      value: this.typeDef.resolveValue(
        value,
        resolver,
        stylesheet,
        control?.child(),
      ),
    }))

    const getStyle = (breakpoint: Breakpoint) => {
      const values = responsiveValues.map(({ deviceId, value }) => ({
        deviceId,
        value: value.readStable(),
      }))

      const breakpointValue = findBreakpointOverride<ResolvedValueType_<Prop>>(
        stylesheet.breakpoints(),
        values,
        breakpoint.id,
        mergeOrCoalesceFallbacks,
      )?.value

      return this.config.getStyle(breakpointValue)
    }

    const stableValue = StableValue({
      name: Definition.type,
      read: () => stylesheet.defineStyle({ getStyle }),
      deps: responsiveValues.map(({ value }) => value),
    })

    return {
      ...stableValue,
      triggerResolve: async () =>
        await Promise.all(
          responsiveValues.map(({ value }) => value.triggerResolve()),
        ),
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
