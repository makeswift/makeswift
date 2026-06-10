import { P, match } from 'ts-pattern'
import { ControlDataTypeKey, ResolveOptions, Types, Schema } from '../prop-controllers'
import { z } from 'zod'
import { WidthLengthData, widthLengthDataSchema } from '../data'

const responsiveWidthLengthDataSchema = Schema.responsiveValue(widthLengthDataSchema)

export type ResponsiveWidthLengthData = z.infer<typeof responsiveWidthLengthDataSchema>

const widthPropControllerDataV0Schema = responsiveWidthLengthDataSchema

export type WidthPropControllerDataV0 = z.infer<
  typeof widthPropControllerDataV0Schema
>

export const WidthPropControllerDataV1Type = 'prop-controllers::width::v1'

const widthPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(WidthPropControllerDataV1Type),
  value: responsiveWidthLengthDataSchema,
})

export type WidthPropControllerDataV1 = z.infer<
  typeof widthPropControllerDataV1Schema
>

export const widthPropControllerDataSchema = z.union([
  widthPropControllerDataV0Schema,
  widthPropControllerDataV1Schema,
])

export type WidthPropControllerData = z.infer<
  typeof widthPropControllerDataSchema
>

export const WidthPropControllerFormat = {
  ClassName: 'makeswift::prop-controllers::width::format::class-name',
  ResponsiveValue:
    'makeswift::prop-controllers::width::format::responsive-value',
} as const

export type WidthPropControllerFormat =
  typeof WidthPropControllerFormat[keyof typeof WidthPropControllerFormat]

type WidthOptions = {
  preset?: WidthPropControllerData
  defaultValue?: WidthLengthData
  format?: WidthPropControllerFormat
  minWidth?: number
}

type WidthDescriptorV0<
  _T = WidthPropControllerDataV0,
  U extends WidthOptions = WidthOptions,
> = {
  type: typeof Types.Width
  options: U
}

type WidthDescriptorV1<
  _T = WidthPropControllerData,
  U extends WidthOptions = WidthOptions,
> = {
  type: typeof Types.Width
  version: 1
  options: U
}

export type WidthDescriptor<
  _T = WidthPropControllerData,
  U extends WidthOptions = WidthOptions,
> = WidthDescriptorV0<_T, U> | WidthDescriptorV1<_T, U>

export type ResolveWidthPropControllerValue<T extends WidthDescriptor> =
  T extends WidthDescriptor
    ? undefined extends ResolveOptions<T['options']>['format']
      ? ResponsiveWidthLengthData | undefined
      : ResolveOptions<
          T['options']
        >['format'] extends typeof WidthPropControllerFormat.ClassName
      ? string
      : ResolveOptions<
          T['options']
        >['format'] extends typeof WidthPropControllerFormat.ResponsiveValue
      ? ResponsiveWidthLengthData | undefined
      : never
    : never

/**
 * @deprecated Imports from `@makeswift/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function Width<T extends WidthOptions>(
  options: T & WidthOptions = {} as T,
): WidthDescriptor<WidthPropControllerData, T> {
  return { type: Types.Width, version: 1, options }
}

Width.Format = WidthPropControllerFormat

export function getWidthPropControllerDataResponsiveLengthData(
  data: WidthPropControllerData | undefined,
): ResponsiveWidthLengthData | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: WidthPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createWidthPropControllerDataFromResponsiveLengthData(
  responsiveLengthData: ResponsiveWidthLengthData,
  definition?: WidthDescriptor,
): WidthPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      P.nullish,
      () =>
        ({
          [ControlDataTypeKey]: WidthPropControllerDataV1Type,
          value: responsiveLengthData,
        } as const),
    )
    .otherwise(() => responsiveLengthData)
}
