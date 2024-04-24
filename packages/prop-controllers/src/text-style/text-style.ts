import { match } from 'ts-pattern'
import {
  ControlDataTypeKey,
  Options,
  Types,
  createResponsiveValueSchema,
} from '../prop-controllers'
import { z } from 'zod'

export const textStyleDataSchema = z
  .object({
    fontFamily: z.string().optional().nullable(),
    letterSpacing: z.number().optional().nullable(),
    fontSize: z
      .object({
        value: z.number(),
        unit: z.literal('px'),
      })
      .optional()
      .nullable(),
    fontWeight: z.number().optional().nullable(),
    textTransform: z.array(z.literal('uppercase')),
    fontStyle: z.array(z.literal('italic')),
  })
  // To make some keys required.
  .transform((v) => ({
    ...v,
    letterSpacing: v.letterSpacing,
    fontSize: v.fontSize,
    fontWeight: v.fontWeight,
    textTransform: v.textTransform,
    fontStyle: v.fontStyle,
  }))

export type TextStyleData = z.infer<typeof textStyleDataSchema>

const responsiveTextStyleDataSchema =
  createResponsiveValueSchema(textStyleDataSchema)

export type ResponsiveTextStyleData = z.infer<
  typeof responsiveTextStyleDataSchema
>

const textStylePropControllerDataV0Schema = responsiveTextStyleDataSchema

export type TextStylePropControllerDataV0 = z.infer<
  typeof textStylePropControllerDataV0Schema
>

export const TextStylePropControllerDataV1Type =
  'prop-controllers::text-style::v1'

const textStylePropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(TextStylePropControllerDataV1Type),
  value: responsiveTextStyleDataSchema,
})

export type TextStylePropControllerDataV1 = z.infer<
  typeof textStylePropControllerDataV1Schema
>

export const textStylePropControllerDataSchema = z.union([
  textStylePropControllerDataV0Schema,
  textStylePropControllerDataV1Schema,
])

export type TextStylePropControllerData = z.infer<
  typeof textStylePropControllerDataSchema
>

export type TextStyleOptions = Options<{
  preset?: TextStylePropControllerData
  label?: string
  hidden?: boolean
}>

type TextStyleDescriptorV0<
  _T = TextStylePropControllerDataV0,
  U extends TextStyleOptions = TextStyleOptions,
> = {
  type: typeof Types.TextStyle
  options: U
}

type TextStyleDescriptorV1<
  _T = TextStylePropControllerData,
  U extends TextStyleOptions = TextStyleOptions,
> = {
  type: typeof Types.TextStyle
  version: 1
  options: U
}

export type TextStyleDescriptor<
  _T = TextStylePropControllerData,
  U extends TextStyleOptions = TextStyleOptions,
> = TextStyleDescriptorV0<_T, U> | TextStyleDescriptorV1<_T, U>

export type ResolveTextStylePropControllerValue<T extends TextStyleDescriptor> =
  T extends TextStyleDescriptor ? ResponsiveTextStyleData | undefined : never

/**
 * @deprecated Imports from `@makeswift/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function TextStyle(
  options: TextStyleOptions = {},
): TextStyleDescriptor<TextStylePropControllerData> {
  return { type: Types.TextStyle, version: 1, options }
}

export function getTextStylePropControllerDataResponsiveTextStyleData(
  data: TextStylePropControllerData | undefined,
): ResponsiveTextStyleData | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: TextStylePropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createTextStylePropControllerDataFromResponsiveTextStyleData(
  responsiveTextStyleData: ResponsiveTextStyleData,
  definition: TextStyleDescriptor,
): TextStylePropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      () =>
        ({
          [ControlDataTypeKey]: TextStylePropControllerDataV1Type,
          value: responsiveTextStyleData,
        } as const),
    )
    .otherwise(() => responsiveTextStyleData)
}
