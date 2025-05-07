import { z } from 'zod'
import { colorDataSchema } from './data'
import {
  ControlDataTypeKey,
  CopyContext,
  Options,
  Types,
  Schema,
} from './prop-controllers'
import { match } from 'ts-pattern'
import {
  ColorData,
  ContextResource,
  getReplacementResourceId,
  shouldRemoveResource,
} from '@makeswift/controls'

const responsiveColorDataSchema = Schema.responsiveValue(colorDataSchema)

export type ResponsiveColorData = z.infer<typeof responsiveColorDataSchema>

const responsiveColorPropControllerDataV0Schema = responsiveColorDataSchema

type ResponsiveColorPropControllerDataV0 = z.infer<
  typeof responsiveColorPropControllerDataV0Schema
>

const ResponsiveColorPropControllerDataV1Type =
  'prop-controllers::responsive-color::v1'

const responsiveColorPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(ResponsiveColorPropControllerDataV1Type),
  value: responsiveColorDataSchema,
})

type ResponsiveColorPropControllerDataV1 = z.infer<
  typeof responsiveColorPropControllerDataV1Schema
>

export const responsiveColorPropControllerDataSchema = z.union([
  responsiveColorPropControllerDataV0Schema,
  responsiveColorPropControllerDataV1Schema,
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

export type ResponsiveColorDescriptor<_T = ResponsiveColorPropControllerData> =
  | ResponsiveColorDescriptorV0
  | ResponsiveColorDescriptorV1

/**
 * @deprecated Imports from `@makeswift/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function ResponsiveColor(
  options: ResponsiveColorOptions = {},
): ResponsiveColorDescriptorV1 {
  return { type: Types.ResponsiveColor, version: 1, options }
}

export function getResponsiveColorPropControllerDataResponsiveColorData(
  data: ResponsiveColorPropControllerData,
): ResponsiveColorData {
  return match(data)
    .with(
      { [ControlDataTypeKey]: ResponsiveColorPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createResponsiveColorPropControllerDataFromResponsiveColorData(
  definition: ResponsiveColorDescriptor,
  responsiveColorData: ResponsiveColorData,
): ResponsiveColorPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      () =>
        ({
          [ControlDataTypeKey]: ResponsiveColorPropControllerDataV1Type,
          value: responsiveColorData,
        }) as const,
    )
    .otherwise(() => responsiveColorData)
}

export function getResponsiveColorDataSwatchIds(
  data: ResponsiveColorData,
): string[] {
  return data.map((override) => override.value.swatchId)
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
    const swatchId = override.value.swatchId

    if (shouldRemoveResource(ContextResource.Swatch, swatchId, context)) {
      return []
    }

    return {
      ...override,
      value: copyColorValue(override.value),
    }
  })

  function copyColorValue(colorValue: ColorData): ColorData {
    return {
      ...colorValue,
      swatchId:
        getReplacementResourceId(
          ContextResource.Swatch,
          colorValue.swatchId,
          context,
        ) ?? colorValue.swatchId,
    }
  }
}

export function copyResponsiveColorPropControllerData(
  data: ResponsiveColorPropControllerData | undefined,
  context: CopyContext,
): ResponsiveColorPropControllerData | undefined {
  return match(data)
    .with(undefined, () => undefined)
    .with(
      { [ControlDataTypeKey]: ResponsiveColorPropControllerDataV1Type },
      (v1) =>
        ({
          [ControlDataTypeKey]: ResponsiveColorPropControllerDataV1Type,
          value: copyResponsiveColorData(v1.value, context),
        }) as const,
    )
    .otherwise((v0) => copyResponsiveColorData(v0, context))
}
