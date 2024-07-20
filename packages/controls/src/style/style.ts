import { z } from 'zod'

import { type CopyContext } from '../context'
import {
  type ResourceResolver,
  type ValueSubscription,
} from '../resource-resolver'

import { type SendMessage } from '../control-instance'

import {
  ControlDefinition,
  safeParse,
  serialize,
  ParseResult,
  SerializedRecord,
} from '../control-definition'

import { mapValues, notNil, nullToUndefined } from '../utils/functional'
import { type Effector } from '../effector'
import { ColorData, Schema, type ResponsiveValue } from '../common'
import { responsiveValue } from '../common/schema'
import { Color } from '../color'
import { IntrospectionTarget } from '../introspect'

import { type BorderData, type BorderSideData } from './types'
import * as StyleSchema from './schema'
import { StyleControl } from './style-control'

type Config = z.infer<typeof Definition.schema.config>

type SchemaType<_C extends Config> = typeof Definition.schema

type DataType<C extends Config> = z.infer<SchemaType<C>['data']>
type ValueType<C extends Config> = z.infer<SchemaType<C>['value']>
type ResolvedValueType<C extends Config> = z.infer<
  SchemaType<C>['resolvedValue']
>

type InstanceType<_C extends Config> = StyleControl

class Definition<C extends Config = Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>,
  InstanceType<C>
> {
  static readonly type = 'makeswift::controls::style' as const
  static readonly Property = {
    Width: `${this.type}::property::width`,
    Margin: `${this.type}::property::margin`,
    Padding: `${this.type}::property::padding`,
    Border: `${this.type}::property::border`,
    BorderRadius: `${this.type}::property::border-radius`,
    TextStyle: `${this.type}::property::text-style`,
  } as const

  static readonly DefaultProperties: StyleProperty[] = [
    this.Property.Width,
    this.Property.Margin,
  ]

  static readonly AllProperties: StyleProperty[] = Object.values(this.Property)

  constructor(readonly config: C) {
    super(config)
  }

  static get schema() {
    const type = z.literal(Definition.type)

    const properties = z.union([
      z.literal(this.Property.Width),
      z.literal(this.Property.Margin),
      z.literal(this.Property.Padding),
      z.literal(this.Property.Border),
      z.literal(this.Property.BorderRadius),
      z.literal(this.Property.TextStyle),
    ])

    const config = z.object({
      properties: z.array(properties),
    })

    const dataSchema = <C extends z.ZodTypeAny>(color: C) =>
      z.object({
        width: responsiveValue(StyleSchema.width).optional(),
        margin: responsiveValue(StyleSchema.margin).optional(),
        padding: responsiveValue(StyleSchema.padding).optional(),
        border: responsiveValue(StyleSchema.borderSchema(color)).optional(),
        borderRadius: responsiveValue(StyleSchema.borderRadius).optional(),
        textStyle: responsiveValue(StyleSchema.textStyle).optional(),
      })

    const data = dataSchema(Schema.colorData)
    const resolvedData = dataSchema(Schema.resolvedColorData)

    const value = data
    const resolvedValue = z.string()

    const definition = z.object({
      type,
      config,
    })

    return {
      type,
      config,
      definition,
      data,
      resolvedData,
      value,
      resolvedValue,
    }
  }

  static deserialize(data: SerializedRecord): Definition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Style: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { config } = Definition.schema.definition.parse(data)
    return new Definition(config)
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    return Definition.schema
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    return this.schema.data.optional().parse(data)
  }

  toData(value: ValueType<C>): DataType<C> {
    return value
  }

  copyData(
    data: DataType<C> | undefined,
    context: CopyContext,
  ): DataType<C> | undefined {
    if (data == null) return data

    return {
      ...data,
      border: mapBorderSides(data.border, (side) =>
        side.color == null
          ? side
          : {
              ...side,
              color: Color().copyData(side.color, context),
            },
      ),
    }
  }

  resolveValue(
    data: DataType<C> | undefined,
    resolver: ResourceResolver,
    effector: Effector,
    control?: InstanceType<C>,
  ): ValueSubscription<ResolvedValueType<C> | undefined> {
    const resolved: ValueSubscription<unknown>[] = []

    const resolveSwatch = (color: ColorData | null | undefined) => {
      const r = Color().resolveSwatch(nullToUndefined(color), resolver)
      resolved.push(r)
      return r.readStableValue()
    }

    const resolvedData =
      data != null
        ? {
            ...data,
            border: mapBorderSides(data.border, (side) => ({
              ...side,
              color: resolveSwatch(side?.color),
            })),
          }
        : undefined

    return {
      readStableValue: (previous?: ResolvedValueType<C>) => {
        return resolvedData != null
          ? effector.defineStyle(
              previous,
              this.config.properties,
              resolvedData,
              (boxModel) => control?.changeBoxModel(boxModel),
            )
          : undefined
      },
      subscribe: () => () => {},
    }
  }

  createInstance(sendMessage: SendMessage<any>) {
    return new StyleControl(sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
  }

  introspect<R>(data: DataType<C> | undefined, target: IntrospectionTarget<R>) {
    if (data == null) return []

    const introspectedProperties = mapValues(
      data,
      (responsiveProperty) =>
        responsiveProperty
          ?.map((override) => target.introspect(override.value))
          .flat() ?? [],
    )

    return Object.values(introspectedProperties).flat().filter(notNil)
  }
}

function mapBorderSides<R>(
  responsibeBorder: ResponsiveValue<BorderData> | undefined,
  callback: (side: BorderSideData) => R,
) {
  return responsibeBorder?.map((deviceBorder) => ({
    ...deviceBorder,
    value: mapValues(
      deviceBorder.value,
      (side: BorderSideData | undefined | null) =>
        side == null ? side : callback(side),
    ),
  }))
}

export const Style = <C extends Config>(config?: C) =>
  new (class Style extends Definition<C> {})(
    config ??
      ({
        properties: Definition.DefaultProperties,
      } as C),
  )

Style.Default = Definition.DefaultProperties
Style.All = Definition.AllProperties
Style.Width = Definition.Property.Width
Style.Margin = Definition.Property.Margin
Style.Padding = Definition.Property.Padding
Style.Border = Definition.Property.Border
Style.BorderRadius = Definition.Property.BorderRadius
Style.TextStyle = Definition.Property.TextStyle

export type StyleProperty =
  (typeof Definition.Property)[keyof typeof Definition.Property]

export type ResolvedStyleData = z.infer<Definition['schema']['resolvedData']>

export { Definition as StyleDefinition }
