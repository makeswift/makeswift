import { P, match } from 'ts-pattern'
import {
  ControlDataTypeKey,
  ResolveOptions,
  Types,
  createResponsiveValueSchema,
} from '../prop-controllers'
import { z } from 'zod'

const paddingSideDataSchema = z.object({
  value: z.number(),
  unit: z.literal('px'),
})

export type PaddingSideData = z.infer<typeof paddingSideDataSchema>

const paddingDataSchema = z
  .object({
    paddingTop: paddingSideDataSchema.nullable().optional(),
    paddingRight: paddingSideDataSchema.nullable().optional(),
    paddingBottom: paddingSideDataSchema.nullable().optional(),
    paddingLeft: paddingSideDataSchema.nullable().optional(),
  })
  // To make the key required.
  .transform((v) => ({
    paddingTop: v.paddingTop,
    paddingRight: v.paddingRight,
    paddingBottom: v.paddingBottom,
    paddingLeft: v.paddingLeft,
  }))

export type PaddingData = z.infer<typeof paddingDataSchema>

const responsivePaddingDataSchema =
  createResponsiveValueSchema(paddingDataSchema)

export type ResponsivePaddingData = z.infer<typeof responsivePaddingDataSchema>

const paddingPropControllerDataV0Schema = responsivePaddingDataSchema

export type PaddingPropControllerDataV0 = z.infer<
  typeof paddingPropControllerDataV0Schema
>

export const PaddingPropControllerDataV1Type = 'prop-controllers::padding::v1'

const paddingPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(PaddingPropControllerDataV1Type),
  value: responsivePaddingDataSchema,
})

export type PaddingPropControllerDataV1 = z.infer<
  typeof paddingPropControllerDataV1Schema
>

export const paddingPropControllerDataSchema = z.union([
  paddingPropControllerDataV0Schema,
  paddingPropControllerDataV1Schema,
])

export type PaddingPropControllerData = z.infer<
  typeof paddingPropControllerDataSchema
>

export const PaddingPropControllerFormat = {
  ClassName: 'makeswift::prop-controllers::padding::format::class-name',
  ResponsiveValue:
    'makeswift::prop-controllers::padding::format::responsive-value',
} as const

export type PaddingPropControllerFormat =
  typeof PaddingPropControllerFormat[keyof typeof PaddingPropControllerFormat]

type PaddingOptions = {
  preset?: PaddingPropControllerData
  format?: PaddingPropControllerFormat
}

type PaddingDescriptorV0<
  _T = PaddingPropControllerDataV0,
  U extends PaddingOptions = PaddingOptions,
> = {
  type: typeof Types.Padding
  options: U
}

type PaddingDescriptorV1<
  _T = PaddingPropControllerData,
  U extends PaddingOptions = PaddingOptions,
> = {
  type: typeof Types.Padding
  version: 1
  options: U
}

export type PaddingDescriptor<
  _T = PaddingPropControllerData,
  U extends PaddingOptions = PaddingOptions,
> = PaddingDescriptorV0<_T, U> | PaddingDescriptorV1<_T, U>

export type ResolvePaddingPropControllerValue<T extends PaddingDescriptor> =
  T extends PaddingDescriptor
    ? undefined extends ResolveOptions<T['options']>['format']
      ? ResponsivePaddingData | undefined
      : ResolveOptions<
          T['options']
        >['format'] extends typeof PaddingPropControllerFormat.ClassName
      ? string
      : ResolveOptions<
          T['options']
        >['format'] extends typeof PaddingPropControllerFormat.ResponsiveValue
      ? ResponsivePaddingData | undefined
      : never
    : never

/**
 * @deprecated Imports from `@makeswift/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function Padding<T extends PaddingOptions>(
  options: T & PaddingOptions = {} as T,
): PaddingDescriptor<PaddingPropControllerData, T> {
  return { type: Types.Padding, version: 1, options }
}

Padding.Format = PaddingPropControllerFormat

export function getPaddingPropControllerDataResponsivePaddingData(
  data: PaddingPropControllerData | undefined,
): ResponsivePaddingData | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: PaddingPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createPaddingPropControllerDataFromResponsivePaddingData(
  responsivePaddingData: ResponsivePaddingData,
  definition?: PaddingDescriptor,
): PaddingPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      P.nullish,
      () =>
        ({
          [ControlDataTypeKey]: PaddingPropControllerDataV1Type,
          value: responsivePaddingData,
        } as const),
    )
    .otherwise(() => responsivePaddingData)
}
