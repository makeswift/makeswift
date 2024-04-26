import { match } from 'ts-pattern'
import { ControlDataTypeKey, Options, Types } from '../prop-controllers'
import { z } from 'zod'
import { GapData, ResponsiveGapData, responsiveGapDataSchema } from '../data'

const gapXPropControllerDataV0Schema = responsiveGapDataSchema

export type GapXPropControllerDataV0 = z.infer<
  typeof gapXPropControllerDataV0Schema
>

export const GapXPropControllerDataV1Type = 'prop-controllers::gap-x::v1'

const gapXPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(GapXPropControllerDataV1Type),
  value: responsiveGapDataSchema,
})

export type GapXPropControllerDataV1 = z.infer<
  typeof gapXPropControllerDataV1Schema
>

export const gapXPropControllerDataSchema = z.union([
  gapXPropControllerDataV0Schema,
  gapXPropControllerDataV1Schema,
])

export type GapXPropControllerData = z.infer<
  typeof gapXPropControllerDataSchema
>

export type GapXOptions = Options<{
  preset?: ResponsiveGapData
  label?: string
  defaultValue?: GapData
  min?: number
  max?: number
  step?: number
  hidden?: boolean
}>

type GapXDescriptorV0<
  _T = GapXPropControllerDataV0,
  U extends GapXOptions = GapXOptions,
> = {
  type: typeof Types.GapX
  options: U
}

type GapXDescriptorV1<
  _T = GapXPropControllerData,
  U extends GapXOptions = GapXOptions,
> = {
  type: typeof Types.GapX
  version: 1
  options: U
}

export type GapXDescriptor<
  _T = GapXPropControllerData,
  U extends GapXOptions = GapXOptions,
> = GapXDescriptorV0<_T, U> | GapXDescriptorV1<_T, U>

export type ResolveGapXPropControllerValue<T extends GapXDescriptor> =
  T extends GapXDescriptor ? ResponsiveGapData | undefined : never

/**
 * @deprecated Imports from `@makeswift/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function GapX(
  options: GapXOptions = {},
): GapXDescriptor<GapXPropControllerData> {
  return { type: Types.GapX, version: 1, options }
}

export function getGapXPropControllerDataResponsiveGapData(
  data: GapXPropControllerData | undefined,
): ResponsiveGapData | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: GapXPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createGapXPropControllerDataFromResponsiveGapData(
  responsiveGapData: ResponsiveGapData,
  definition: GapXDescriptor,
): GapXPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      () =>
        ({
          [ControlDataTypeKey]: GapXPropControllerDataV1Type,
          value: responsiveGapData,
        } as const),
    )
    .otherwise(() => responsiveGapData)
}
