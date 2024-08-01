import { z } from 'zod'

import {
  type ColorData,
  type ResolvedColorData,
  type ResponsiveValue,
  Schema,
} from '../common'

import { responsiveValue } from '../common/schema'

import { type CopyContext } from '../context'
import { type ResourceResolver } from '../resource-resolver'
import { type Effector } from '../effector'
import {
  IntrospectionTargetType,
  type IntrospectionTarget,
} from '../introspect'
import { type SendMessage } from '../control-instance'

import {
  ControlDefinition,
  safeParse,
  serialize,
  type ParseResult,
  type SerializedRecord,
  type Resolvable,
} from '../control-definition'

import { Color } from '../color'

import { mapValues, notNil, nullToUndefined } from '../utils/functional'

import { type BorderData, type BorderSideData } from './types'
import * as StyleSchema from './schema'
import { StyleControl } from './style-control'
import { match, P } from 'ts-pattern'

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
  ): Resolvable<ResolvedValueType<C> | undefined> {
    const resolvedColors = new Map<
      string,
      Resolvable<ResolvedColorData | undefined>
    >(
      [...borderColors(data?.border)].map((color) => [
        color.swatchId,
        Color().resolveSwatch(nullToUndefined(color), resolver),
      ]),
    )

    const resolvedColor = (swatchId: string | undefined) =>
      swatchId ? resolvedColors.get(swatchId)?.readStableValue() : undefined

    const resolvedStyle = (data: DataType<C>) => ({
      ...data,
      border: mapBorderSides(data.border, (side) => ({
        ...side,
        color: resolvedColor(side?.color?.swatchId),
      })),
    })

    return {
      readStableValue: (previous?: ResolvedValueType<C>) => {
        return data != null
          ? effector.computeClassName(
              previous,
              this.config.properties,
              resolvedStyle(data),
            )
          : undefined
      },

      subscribe: (onUpdate: () => void) => {
        const unsubscribes = [...resolvedColors.values()].map((v) =>
          v.subscribe(onUpdate),
        )

        return () => unsubscribes?.forEach((u) => u())
      },

      triggerResolve: async (currentValue?: ResolvedValueType<C>) => {
        if (data != null && currentValue != null) {
          effector.defineStyle(
            currentValue,
            this.config.properties,
            resolvedStyle(data),
            (boxModel) => control?.changeBoxModel(boxModel),
          )
        }

        await Promise.all(
          [...resolvedColors.values()].map((r) => r.triggerResolve()),
        )
      },
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
    if (data == null || target.type !== IntrospectionTargetType.Swatch) {
      return []
    }

    return Object.values(data)
      .flat()
      .flatMap((override) =>
        match(override.value)
          .with(
            P.union(
              { borderTop: { color: P.any } },
              { borderLeft: { color: P.any } },
              { borderBottom: { color: P.any } },
              { borderRight: { color: P.any } },
            ),
            (overrideValue) => [
              overrideValue.borderBottom?.color,
              overrideValue.borderTop?.color,
              overrideValue.borderLeft?.color,
              overrideValue.borderRight?.color,
            ],
          )
          .otherwise(() => [null]),
      )
      .flatMap((color) => target.introspect(color))
  }
}

function* borderColors(
  responsibeBorder: ResponsiveValue<BorderData> | undefined,
): Generator<ColorData> {
  for (const deviceBorder of responsibeBorder ?? []) {
    const sides = deviceBorder.value
    for (const side of Object.values(sides)) {
      if (side?.color != null) {
        yield side?.color
      }
    }
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
