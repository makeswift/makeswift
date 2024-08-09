import { z } from 'zod'
import { LengthData, lengthDataSchema } from './data'
import { ControlDataTypeKey, Options, Types, Schema } from './prop-controllers'
import { match } from 'ts-pattern'

export const responsiveLengthDataSchema =
  Schema.responsiveValue(lengthDataSchema)

export type ResponsiveLengthData = z.infer<typeof responsiveLengthDataSchema>

export const responsiveLengthPropControllerDataV0Schema =
  responsiveLengthDataSchema

type ResponsiveLengthPropControllerDataV0 = z.infer<
  typeof responsiveLengthPropControllerDataV0Schema
>

export const ResponsiveLengthPropControllerDataV1Type =
  'prop-controllers::responsive-length::v1'

const responsiveLengthPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(ResponsiveLengthPropControllerDataV1Type),
  value: responsiveLengthDataSchema,
})

type ResponsiveLengthPropControllerDataV1 = z.infer<
  typeof responsiveLengthPropControllerDataV1Schema
>

export const responsiveLengthPropControllerDataSchema = z.union([
  responsiveLengthPropControllerDataV0Schema,
  responsiveLengthPropControllerDataV1Schema,
])

export type ResponsiveLengthPropControllerData = z.infer<
  typeof responsiveLengthPropControllerDataSchema
>

export type LengthOption =
  | { value: 'px'; label: 'Pixels'; icon: 'Px16' }
  | { value: '%'; label: 'Percentage'; icon: 'Percent16' }

export type ResponsiveLengthOptions = Options<{
  preset?: ResponsiveLengthPropControllerData
  label?: string
  options?: LengthOption[]
  defaultValue?: LengthData
  hidden?: boolean
}>

type ResponsiveLengthDescriptorV0<_T = ResponsiveLengthPropControllerDataV0> = {
  type: typeof Types.ResponsiveLength
  options: ResponsiveLengthOptions
}

type ResponsiveLengthDescriptorV1<_T = ResponsiveLengthPropControllerDataV1> = {
  type: typeof Types.ResponsiveLength
  version: 1
  options: ResponsiveLengthOptions
}

export type ResponsiveLengthDescriptor<
  _T = ResponsiveLengthPropControllerData,
> = ResponsiveLengthDescriptorV0<_T> | ResponsiveLengthDescriptorV1<_T>

export type ResolveResponsiveLengthPropControllerValue<
  T extends ResponsiveLengthDescriptor,
> = T extends ResponsiveLengthDescriptor
  ? ResponsiveLengthData | undefined
  : never

/**
 * @deprecated Imports from `@makeswift/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function ResponsiveLength(
  options: ResponsiveLengthOptions = {},
): ResponsiveLengthDescriptorV1 {
  return { type: Types.ResponsiveLength, version: 1, options }
}

export function getResponsiveLengthPropControllerDataResponsiveLengthData(
  data: ResponsiveLengthPropControllerData,
): ResponsiveLengthData {
  return match(data)
    .with(
      { [ControlDataTypeKey]: ResponsiveLengthPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createResponsiveLengthPropControllerDataFromResponsiveLengthData(
  definition: ResponsiveLengthDescriptor,
  responsiveLengthData: ResponsiveLengthData,
): ResponsiveLengthPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      () =>
        ({
          [ControlDataTypeKey]: ResponsiveLengthPropControllerDataV1Type,
          value: responsiveLengthData,
        }) as const,
    )
    .otherwise(() => responsiveLengthData)
}
