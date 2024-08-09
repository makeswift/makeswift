import { P, match } from 'ts-pattern'
import {
  ControlDataTypeKey,
  ResolveOptions,
  Types,
  Schema,
} from '../prop-controllers'
import { z } from 'zod'

const marginSideDataSchema = z.union([
  z.object({
    value: z.number(),
    unit: z.literal('px'),
  }),
  z.literal('auto'),
])

export type MarginSideData = z.infer<typeof marginSideDataSchema>

const marginDataSchema = z
  .object({
    marginTop: marginSideDataSchema.nullable().optional(),
    marginRight: marginSideDataSchema.nullable().optional(),
    marginBottom: marginSideDataSchema.nullable().optional(),
    marginLeft: marginSideDataSchema.nullable().optional(),
  })
  // To make the key required.
  .transform((v) => ({
    marginTop: v.marginTop,
    marginRight: v.marginRight,
    marginBottom: v.marginBottom,
    marginLeft: v.marginLeft,
  }))

export type MarginData = z.infer<typeof marginDataSchema>

const responsiveMarginDataSchema = Schema.responsiveValue(marginDataSchema)

export type ResponsiveMarginData = z.infer<typeof responsiveMarginDataSchema>

const marginPropControllerDataV0Schema = responsiveMarginDataSchema

export type MarginPropControllerDataV0 = z.infer<
  typeof marginPropControllerDataV0Schema
>

export const MarginPropControllerDataV1Type = 'prop-controllers::margin::v1'

const marginPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(MarginPropControllerDataV1Type),
  value: responsiveMarginDataSchema,
})

export type MarginPropControllerDataV1 = z.infer<
  typeof marginPropControllerDataV1Schema
>

export const marginPropControllerDataSchema = z.union([
  marginPropControllerDataV0Schema,
  marginPropControllerDataV1Schema,
])

export type MarginPropControllerData = z.infer<
  typeof marginPropControllerDataSchema
>

export const MarginPropControllerFormat = {
  ClassName: 'makeswift::prop-controllers::margin::format::class-name',
  ResponsiveValue:
    'makeswift::prop-controllers::margin::format::responsive-value',
} as const

export type MarginPropControllerFormat =
  (typeof MarginPropControllerFormat)[keyof typeof MarginPropControllerFormat]

type MarginOptions = {
  preset?: MarginPropControllerData
  format?: MarginPropControllerFormat
}

type MarginDescriptorV0<
  _T = MarginPropControllerDataV0,
  U extends MarginOptions = MarginOptions,
> = {
  type: typeof Types.Margin
  options: U
}

type MarginDescriptorV1<
  _T = MarginPropControllerData,
  U extends MarginOptions = MarginOptions,
> = {
  type: typeof Types.Margin
  version: 1
  options: U
}

export type MarginDescriptor<
  _T = MarginPropControllerData,
  U extends MarginOptions = MarginOptions,
> = MarginDescriptorV0<_T, U> | MarginDescriptorV1<_T, U>

export type ResolveMarginPropControllerValue<T extends MarginDescriptor> =
  T extends MarginDescriptor
    ? undefined extends ResolveOptions<T['options']>['format']
      ? ResponsiveMarginData | undefined
      : ResolveOptions<
            T['options']
          >['format'] extends typeof MarginPropControllerFormat.ClassName
        ? string
        : ResolveOptions<
              T['options']
            >['format'] extends typeof MarginPropControllerFormat.ResponsiveValue
          ? ResponsiveMarginData | undefined
          : never
    : never

/**
 * @deprecated Imports from `@makeswift/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function Margin<T extends MarginOptions>(
  options: T & MarginOptions = {} as T,
): MarginDescriptor<MarginPropControllerData, T> {
  return { type: Types.Margin, version: 1, options }
}

Margin.Format = MarginPropControllerFormat

export function getMarginPropControllerDataResponsiveMarginData(
  data: MarginPropControllerData | undefined,
): ResponsiveMarginData | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: MarginPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createMarginPropControllerDataFromResponsiveMarginData(
  responsiveMarginData: ResponsiveMarginData,
  definition?: MarginDescriptor,
): MarginPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      P.nullish,
      () =>
        ({
          [ControlDataTypeKey]: MarginPropControllerDataV1Type,
          value: responsiveMarginData,
        }) as const,
    )
    .otherwise(() => responsiveMarginData)
}
