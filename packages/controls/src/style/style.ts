import { z } from 'zod'
import { CopyContext } from '../context'

import { ResourceResolver, ValueSubscription } from '../resource-resolver'

import { ControlInstance, SendMessage } from '../control-instance'

import {
  ControlDefinition,
  safeParse,
  serialize,
  ParseResult,
  SerializedRecord,
} from '../control-definition'
import { type Effector } from '../effector'
import {
  BorderPropertyData,
  borderPropertyDataSchema,
  borderRadiusDataSchema,
  BorderSideShorthandPropertyData,
  marginDataSchema,
  paddingDataSchema,
  textStylePropertyDataSchema,
  widthDataSchema,
} from './data-types'
import { StyleControl } from './style-control'

import { createResponsiveValueSchema, ResponsiveValue } from '../common'
import { Color } from '../color'
import { mapValues, notNil } from '../utils/functional'
import { IntrospectionTarget } from '../introspect'

export const StyleControlProperty = {
  Width: 'makeswift::controls::style::property::width',
  Margin: 'makeswift::controls::style::property::margin',
  Padding: 'makeswift::controls::style::property::padding',
  Border: 'makeswift::controls::style::property::border',
  BorderRadius: 'makeswift::controls::style::property::border-radius',
  TextStyle: 'makeswift::controls::style::property::text-style',
} as const

export type StyleControlProperty =
  (typeof StyleControlProperty)[keyof typeof StyleControlProperty]

const StyleControlDefaultProperties: StyleControlProperty[] = [
  StyleControlProperty.Width,
  StyleControlProperty.Margin,
]

const AllStyleControlProperties: StyleControlProperty[] = [
  StyleControlProperty.Width,
  StyleControlProperty.Margin,
  StyleControlProperty.Padding,
  StyleControlProperty.Border,
  StyleControlProperty.BorderRadius,
  StyleControlProperty.TextStyle,
]

type Config = z.infer<typeof Definition.schema.config>

type DataSchemaType<_C extends Config> = typeof Definition.schema

type DataType<C extends Config> = z.infer<DataSchemaType<C>['data']>
type ValueType<C extends Config> = z.infer<DataSchemaType<C>['value']>
type ResolvedValueType<C extends Config> = z.infer<
  DataSchemaType<C>['resolvedValue']
>

class Definition<C extends Config = Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>
> {
  static readonly type = 'makeswift::controls::style' as const

  constructor(readonly config: C) {
    super(config)
  }

  static get schema() {
    const type = z.literal(Definition.type)

    const properties = z.union([
      z.literal(StyleControlProperty.Width),
      z.literal(StyleControlProperty.Margin),
      z.literal(StyleControlProperty.Padding),
      z.literal(StyleControlProperty.Border),
      z.literal(StyleControlProperty.BorderRadius),
      z.literal(StyleControlProperty.TextStyle),
    ])

    const config = z.object({
      properties: z.array(properties),
    })

    const data = z.object({
      width: createResponsiveValueSchema(widthDataSchema).optional(),
      margin: createResponsiveValueSchema(marginDataSchema).optional(),
      padding: createResponsiveValueSchema(paddingDataSchema).optional(),
      border: createResponsiveValueSchema(borderPropertyDataSchema).optional(),
      borderRadius: createResponsiveValueSchema(
        borderRadiusDataSchema,
      ).optional(),
      textStyle: createResponsiveValueSchema(
        textStylePropertyDataSchema,
      ).optional(),
    })

    const value = data
    const resolvedValue = z.unknown()

    const definition = z.object({
      type,
      config,
    })

    return {
      type,
      config,
      definition,
      data,
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

    const { config } = this.schema.definition.parse(data)
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

    function copyResponsiveBorder(
      responsiveBorder: ResponsiveValue<BorderPropertyData> | undefined,
    ) {
      if (responsiveBorder == null) return undefined
      return responsiveBorder.map((deviceBorder) => ({
        ...deviceBorder,
        value: mapValues(
          deviceBorder.value,
          (side: BorderSideShorthandPropertyData | undefined | null) => {
            if (side == null) return null
            if (side.color == null) return side
            return {
              ...side,
              color: Color().copyData(side.color, context),
            }
          },
        ),
      }))
    }

    return { ...data, border: copyResponsiveBorder(data.border) }
  }

  resolveValue(
    data: DataType<C> | undefined,
    _resolver: ResourceResolver,
    _effector: Effector,
  ): ValueSubscription<ResolvedValueType<C> | undefined> {
    return {
      readStableValue: (_previous?: ResolvedValueType<C>) => {
        return this.fromData(data)
      },
      subscribe: () => () => {},
    }
  }

  createInstance(sendMessage: SendMessage<any>): ControlInstance<any> {
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

export const Style = <C extends Config>(config?: C) =>
  new (class Style extends Definition<C> {})(
    config ??
      ({
        properties: StyleControlDefaultProperties,
      } as C),
  )

Style.Default = StyleControlDefaultProperties
Style.All = AllStyleControlProperties
Style.Width = StyleControlProperty.Width
Style.Margin = StyleControlProperty.Margin
Style.Padding = StyleControlProperty.Padding
Style.Border = StyleControlProperty.Border
Style.BorderRadius = StyleControlProperty.BorderRadius
Style.TextStyle = StyleControlProperty.TextStyle

export { Definition as StyleDefinition }
