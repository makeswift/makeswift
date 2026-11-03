import { z } from 'zod'
import {
  copyColorDataV2,
  ResourceSchema,
  toColorDataV1,
  toColorDataV2,
  type ColorDataV2,
} from '@makeswift/controls'
import {
  colorDataSchema,
  getColorDataV2SwatchIds,
  type ColorData,
} from '../data'
import {
  ControlDataTypeKey,
  CopyContext,
  Options,
  Types,
  Schema,
} from '../prop-controllers'
import { match } from 'ts-pattern'

export const responsiveColorDataSchema = <C extends z.ZodTypeAny>(color: C) =>
  Schema.responsiveValue(color)

export type ResponsiveColor<Color> = z.infer<
  ReturnType<typeof responsiveColorDataSchema<z.ZodType<Color>>>
>

export type ResponsiveColorDataV1 = ResponsiveColor<ColorData>

export type ResponsiveColorData = ResponsiveColor<ColorDataV2>

const responsiveColorPropControllerDataV0Schema =
  responsiveColorDataSchema(colorDataSchema)

type ResponsiveColorPropControllerDataV0 = z.infer<
  typeof responsiveColorPropControllerDataV0Schema
>

const ResponsiveColorPropControllerDataV1Type =
  'prop-controllers::responsive-color::v1'

const responsiveColorPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(ResponsiveColorPropControllerDataV1Type),
  value: responsiveColorDataSchema(colorDataSchema),
})

type ResponsiveColorPropControllerDataV1 = z.infer<
  typeof responsiveColorPropControllerDataV1Schema
>

/** v2 colors are either a swatch or an inline color */
const ResponsiveColorPropControllerDataV2Type =
  'prop-controllers::responsive-color::v2'

const responsiveColorPropControllerDataV2Schema = z.object({
  [ControlDataTypeKey]: z.literal(ResponsiveColorPropControllerDataV2Type),
  value: responsiveColorDataSchema(ResourceSchema.colorDataV2),
})

type ResponsiveColorPropControllerDataV2 = z.infer<
  typeof responsiveColorPropControllerDataV2Schema
>

export const responsiveColorPropControllerDataSchema = z.union([
  responsiveColorPropControllerDataV0Schema,
  responsiveColorPropControllerDataV1Schema,
  responsiveColorPropControllerDataV2Schema,
])

export type ResponsiveColorPropControllerData = z.infer<
  typeof responsiveColorPropControllerDataSchema
>

export type ResponsiveColorOptions = Options<{
  label?: string
  placeholder?: string
  hidden?: boolean
}>

type ResponsiveColorDescriptorV0<_T = ResponsiveColorPropControllerDataV0> = {
  type: typeof Types.ResponsiveColor
  options: ResponsiveColorOptions
}

type ResponsiveColorDescriptorV1<_T = ResponsiveColorPropControllerDataV1> = {
  type: typeof Types.ResponsiveColor
  version: 1
  options: ResponsiveColorOptions
}

type ResponsiveColorDescriptorV2<_T = ResponsiveColorPropControllerDataV2> = {
  type: typeof Types.ResponsiveColor
  version: 2
  options: ResponsiveColorOptions
}

export type ResponsiveColorDescriptor<_T = ResponsiveColorPropControllerData> =
  | ResponsiveColorDescriptorV0
  | ResponsiveColorDescriptorV1
  | ResponsiveColorDescriptorV2

/**
 * @deprecated Imports from `@makeswift/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function ResponsiveColor(
  options: ResponsiveColorOptions = {},
): ResponsiveColorDescriptorV2 {
  return { type: Types.ResponsiveColor, version: 2, options }
}

export function toResponsiveColorDataV2(
  data: ResponsiveColorDataV1,
): ResponsiveColorData {
  return data.map((override) => ({
    ...override,
    value: toColorDataV2(override.value),
  }))
}

export function toResponsiveColorDataV1(
  data: ResponsiveColorData,
): ResponsiveColorDataV1 {
  return data.map((override) => ({
    ...override,
    value: toColorDataV1(override.value),
  }))
}

export function getResponsiveColorPropControllerDataResponsiveColorData(
  data: ResponsiveColorPropControllerData,
): ResponsiveColorData {
  return match(data)
    .with(
      { [ControlDataTypeKey]: ResponsiveColorPropControllerDataV2Type },
      (v2) => v2.value,
    )
    .with(
      { [ControlDataTypeKey]: ResponsiveColorPropControllerDataV1Type },
      (v1) => toResponsiveColorDataV2(v1.value),
    )
    .otherwise((v0) => toResponsiveColorDataV2(v0))
}

export function createResponsiveColorPropControllerDataFromResponsiveColorData(
  definition: ResponsiveColorDescriptor,
  responsiveColorData: ResponsiveColorData,
): ResponsiveColorPropControllerData {
  return match(definition)
    .with(
      { version: 2 },
      () =>
        ({
          [ControlDataTypeKey]: ResponsiveColorPropControllerDataV2Type,
          value: responsiveColorData,
        }) as const,
    )
    .with(
      { version: 1 },
      () =>
        ({
          [ControlDataTypeKey]: ResponsiveColorPropControllerDataV1Type,
          value: toResponsiveColorDataV1(responsiveColorData),
        }) as const,
    )
    .otherwise(() => toResponsiveColorDataV1(responsiveColorData))
}

export function getResponsiveColorDataSwatchIds(
  data: ResponsiveColorData,
): string[] {
  return data.flatMap((override) => getColorDataV2SwatchIds(override.value))
}

export function getResponsiveColorPropControllerDataSwatchIds(
  data: ResponsiveColorPropControllerData | undefined | null,
): string[] {
  if (data == null) return []

  return getResponsiveColorDataSwatchIds(
    getResponsiveColorPropControllerDataResponsiveColorData(data),
  )
}

export function copyResponsiveColorData(
  data: ResponsiveColorData,
  context: CopyContext,
): ResponsiveColorData {
  return data.flatMap((override) => {
    const value = copyColorDataV2(override.value, context)
    return value == null ? [] : [{ ...override, value }]
  })
}

export function copyResponsiveColorPropControllerData(
  data: ResponsiveColorPropControllerData | undefined,
  context: CopyContext,
): ResponsiveColorPropControllerData | undefined {
  const copy = (data: ResponsiveColorDataV1) =>
    toResponsiveColorDataV1(
      copyResponsiveColorData(toResponsiveColorDataV2(data), context),
    )

  return match(data)
    .with(undefined, () => undefined)
    .with(
      { [ControlDataTypeKey]: ResponsiveColorPropControllerDataV2Type },
      (v2) => ({ ...v2, value: copyResponsiveColorData(v2.value, context) }),
    )
    .with(
      { [ControlDataTypeKey]: ResponsiveColorPropControllerDataV1Type },
      (v1) => ({ ...v1, value: copy(v1.value) }),
    )
    .otherwise((v0) => copy(v0))
}
