import { match, P } from 'ts-pattern'
import { z } from 'zod'

import { mapValues, nullToUndefined } from '../../lib/functional'
import { StableValue } from '../../lib/stable-value'
import { safeParse, type ParseResult } from '../../lib/zod'

import { type ResponsiveValue } from '../../common'
import { responsiveValue } from '../../common/schema'
import { type CopyContext } from '../../context'
import { Targets, type IntrospectionTarget } from '../../introspection'
import {
  ResourceSchema,
  type ColorData,
  type ResolvedColorData,
} from '../../resources'
import { type ResourceResolver } from '../../resources/resolver'
import {
  type DeserializedRecord,
  type SerializedRecord,
} from '../../serialization'
import { type Stylesheet } from '../../stylesheet'

import { Color } from '../color'
import {
  ControlDefinition,
  serialize,
  type Resolvable,
  type SchemaType,
} from '../definition'
import { type SendMessage } from '../instance'

import * as StyleSchema from './schema'
import { StyleControl } from './style-control'
import { type BorderData, type BorderSideData } from './types'

type Config = z.infer<typeof Definition.schema.config>

type Schema<_C extends Config> = typeof Definition.schema
type DataType<C extends Config> = z.infer<Schema<C>['data']>
type ValueType<C extends Config> = z.infer<Schema<C>['value']>
type ResolvedValueType<C extends Config> = z.infer<Schema<C>['resolvedValue']>

type InstanceType<_C extends Config> = StyleControl

class Definition<C extends Config> extends ControlDefinition<
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

    const data = dataSchema(ResourceSchema.colorData)
    const resolvedData = dataSchema(ResourceSchema.resolvedColorData)

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

  static deserialize(data: DeserializedRecord): StyleDefinition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Style: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { config } = Definition.schema.definition.parse(data)
    return Style(config)
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    return {
      ...Definition.schema,
      data: Definition.schema.data as SchemaType<DataType<C>>,
      value: Definition.schema.value as SchemaType<ValueType<C>>,
    }
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
    stylesheet: Stylesheet,
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
      swatchId ? resolvedColors.get(swatchId)?.readStable() : undefined

    const resolvedStyle = (data: DataType<C>) => ({
      ...data,
      border: mapBorderSides(data.border, (side) => ({
        ...side,
        color: resolvedColor(side?.color?.swatchId),
      })),
    })

    const stableValue = StableValue({
      name: Definition.type,
      read: () =>
        stylesheet.defineStyle(
          {
            properties: this.config.properties,
            styleData: data != null ? resolvedStyle(data) : {},
          },
          (boxModel) => control?.changeBoxModel(boxModel),
        ),
      deps: [...resolvedColors.values()],
    })

    return {
      ...stableValue,
      triggerResolve: () =>
        Promise.all(
          [...resolvedColors.values()].map((r) => r.triggerResolve()),
        ),
    }
  }

  createInstance(sendMessage: SendMessage) {
    return new StyleControl(sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
  }

  introspect<R>(data: DataType<C> | undefined, target: IntrospectionTarget<R>) {
    if (data == null || target.type !== Targets.Swatch.type) {
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

export class StyleDefinition<C extends Config = Config> extends Definition<C> {}

export type StyleProperty =
  (typeof StyleDefinition.Property)[keyof typeof StyleDefinition.Property]

export type ResolvedStyleData = z.infer<
  StyleDefinition['schema']['resolvedData']
>

export function Style(config?: Config): StyleDefinition<Config> {
  return new StyleDefinition<Config>(
    config ?? {
      properties: StyleDefinition.DefaultProperties,
    },
  )
}

Style.Default = StyleDefinition.DefaultProperties
Style.All = StyleDefinition.AllProperties
Style.Width = StyleDefinition.Property.Width
Style.Margin = StyleDefinition.Property.Margin
Style.Padding = StyleDefinition.Property.Padding
Style.Border = StyleDefinition.Property.Border
Style.BorderRadius = StyleDefinition.Property.BorderRadius
Style.TextStyle = StyleDefinition.Property.TextStyle
