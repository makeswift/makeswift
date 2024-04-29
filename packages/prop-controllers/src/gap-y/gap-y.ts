import { match } from 'ts-pattern'
import { ControlDataTypeKey, Options, Types } from '../prop-controllers'
import { z } from 'zod'
import { GapData, ResponsiveGapData, responsiveGapDataSchema } from '../data'

const gapYPropControllerDataV0Schema = responsiveGapDataSchema

export type GapYPropControllerDataV0 = z.infer<
  typeof gapYPropControllerDataV0Schema
>

export const GapYPropControllerDataV1Type = 'prop-controllers::gap-y::v1'

const gapYPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(GapYPropControllerDataV1Type),
  value: responsiveGapDataSchema,
})

export type GapYPropControllerDataV1 = z.infer<
  typeof gapYPropControllerDataV1Schema
>

export const gapYPropControllerDataSchema = z.union([
  gapYPropControllerDataV0Schema,
  gapYPropControllerDataV1Schema,
])

export type GapYPropControllerData = z.infer<
  typeof gapYPropControllerDataSchema
>

export type GapYOptions = Options<{
  preset?: ResponsiveGapData
  label?: string
  defaultValue?: GapData
  min?: number
  max?: number
  step?: number
  hidden?: boolean
}>

type GapYDescriptorV0<
  _T = GapYPropControllerDataV0,
  U extends GapYOptions = GapYOptions,
> = {
  type: typeof Types.GapY
  options: U
}

type GapYDescriptorV1<
  _T = GapYPropControllerData,
  U extends GapYOptions = GapYOptions,
> = {
  type: typeof Types.GapY
  version: 1
  options: U
}

export type GapYDescriptor<
  _T = GapYPropControllerData,
  U extends GapYOptions = GapYOptions,
> = GapYDescriptorV0<_T, U> | GapYDescriptorV1<_T, U>

export type ResolveGapYPropControllerValue<T extends GapYDescriptor> =
  T extends GapYDescriptor ? ResponsiveGapData | undefined : never

/**
 * @deprecated Imports from `@makeswift/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function GapY(
  options: GapYOptions = {},
): GapYDescriptor<GapYPropControllerData> {
  return { type: Types.GapY, version: 1, options }
}

export function getGapYPropControllerDataResponsiveGapData(
  data: GapYPropControllerData | undefined,
): ResponsiveGapData | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: GapYPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createGapYPropControllerDataFromResponsiveGapData(
  responsiveGapData: ResponsiveGapData,
  definition: GapYDescriptor,
): GapYPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      () =>
        ({
          [ControlDataTypeKey]: GapYPropControllerDataV1Type,
          value: responsiveGapData,
        } as const),
    )
    .otherwise(() => responsiveGapData)
}
