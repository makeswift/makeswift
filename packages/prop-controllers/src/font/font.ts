import { P, match } from 'ts-pattern'
import {
  ControlDataTypeKey,
  Options,
  Types,
  createResponsiveValueSchema,
} from '../prop-controllers'
import { z } from 'zod'

const fontDataSchema = z.string()

export type FontData = z.infer<typeof fontDataSchema>

const responsiveFontDataSchema = createResponsiveValueSchema(fontDataSchema)

export type ResponsiveFontData = z.infer<typeof responsiveFontDataSchema>

const fontPropControllerDataV0Schema = responsiveFontDataSchema

export type FontPropControllerDataV0 = z.infer<
  typeof fontPropControllerDataV0Schema
>

export const FontPropControllerDataV1Type = 'prop-controllers::font::v1'

const fontPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(FontPropControllerDataV1Type),
  value: responsiveFontDataSchema,
})

export type FontPropControllerDataV1 = z.infer<
  typeof fontPropControllerDataV1Schema
>

export const fontPropControllerDataSchema = z.union([
  fontPropControllerDataV0Schema,
  fontPropControllerDataV1Schema,
])

export type FontPropControllerData = z.infer<
  typeof fontPropControllerDataSchema
>

type FontOptions = Options<{ preset?: FontPropControllerData; label?: string }>

type FontDescriptorV0<
  _T = FontPropControllerDataV0,
  U extends FontOptions = FontOptions,
> = {
  type: typeof Types.Font
  options: U
}

type FontDescriptorV1<
  _T = FontPropControllerData,
  U extends FontOptions = FontOptions,
> = {
  type: typeof Types.Font
  version: 1
  options: U
}

export type FontDescriptor<
  _T = FontPropControllerData,
  U extends FontOptions = FontOptions,
> = FontDescriptorV0<_T, U> | FontDescriptorV1<_T, U>

export type ResolveFontPropControllerValue<T extends FontDescriptor> =
  T extends FontDescriptor ? ResponsiveFontData | undefined : never

/**
 * @deprecated Imports from `@makeswift/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function Font(
  options: FontOptions = {},
): FontDescriptor<FontPropControllerData> {
  return { type: Types.Font, version: 1, options }
}

export function getFontPropControllerDataResponsiveFontData(
  data: FontPropControllerData | undefined,
): ResponsiveFontData | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: FontPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createFontPropControllerDataFromResponsiveFontData(
  responsiveFontData: ResponsiveFontData,
  definition?: FontDescriptor,
): FontPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      P.nullish,
      () =>
        ({
          [ControlDataTypeKey]: FontPropControllerDataV1Type,
          value: responsiveFontData,
        } as const),
    )
    .otherwise(() => responsiveFontData)
}
