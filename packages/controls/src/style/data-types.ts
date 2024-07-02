import { z } from 'zod'
import { colorDataSchema } from '../common'

// TODO: @arvin this file and many of the types are copied from the dependencies
// of the original runtime style control, but converted to schemas for parsing
// in the Style definition. Leaving note to revisit and see where these
// types/schemas should live.

export const pixelLengthData = z.object({
  value: z.number(),
  unit: z.literal('px'),
})

export type PixelLengthData = z.infer<typeof pixelLengthData>

export const percentageLengthData = z.object({
  value: z.number(),
  unit: z.literal('%'),
})

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/percentage
 */
export type PercentageData = z.infer<typeof percentageLengthData>

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/border-style
 */
const borderStyleSchema = z.union([
  z.literal('dotted'),
  z.literal('dashed'),
  z.literal('solid'),
])

export type BorderStyle = z.infer<typeof borderStyleSchema>

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/border-top#constituent_properties
 *
 * @todos
 * - Change `width` to be a `Length`
 * - Remove `null` from possible values
 * - Remove `undefined` from possible values and make fields optional
 */

const borderSideShorthandPropertyDataSchema = z.object({
  width: z.number().nullable().optional(),
  style: borderStyleSchema,
  color: colorDataSchema.optional().nullable(),
})

export type BorderSideShorthandPropertyData = z.infer<
  typeof borderSideShorthandPropertyDataSchema
>

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/border
 *
 * @todos
 * - Remove `null` from possible values
 * - Remove `undefined` from possible values and make fields optional
 */

export const borderPropertyDataSchema = z.object({
  borderTop: borderSideShorthandPropertyDataSchema.optional().nullable(),
  borderRight: borderSideShorthandPropertyDataSchema.optional().nullable(),
  borderBottom: borderSideShorthandPropertyDataSchema.optional().nullable(),
  borderLeft: borderSideShorthandPropertyDataSchema.optional().nullable(),
})

export type BorderPropertyData = z.infer<typeof borderPropertyDataSchema>

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-family
 *
 * @todos
 * - Remove `null` from possible values of longhand properties
 * - Remove `undefined` from possible values and make fields optional
 */
const fontFamilyPropertyDataSchema = z.string().nullable().optional()
export type FontFamilyPropertyData = z.infer<
  typeof fontFamilyPropertyDataSchema
>

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing
 *
 * @todos
 * - Remove `null` from possible values of longhand properties
 * - Remove `undefined` from possible values and make fields optional
 */
const letterSpacingPropertyDataSchema = z.number().nullable().optional()
export type LetterSpacingPropertyData = z.infer<
  typeof letterSpacingPropertyDataSchema
>

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-size
 *
 * @todos
 * - Remove `null` from possible values of longhand properties
 * - Remove `undefined` from possible values and make fields optional
 */
const fontSizePropertyDataSchema = z
  .object({
    value: z.number(),
    unit: z.literal('px'),
  })
  .nullable()
  .optional()
export type FontSizePropertyData = z.infer<typeof fontSizePropertyDataSchema>

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight
 *
 * @todos
 * - Remove `null` from possible values of longhand properties
 * - Remove `undefined` from possible values and make fields optional
 */
const fontWeightPropertyDataSchema = z.number().nullable().optional()
export type FontWeightPropertyData = z.infer<
  typeof fontWeightPropertyDataSchema
>

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform
 *
 * @todos
 * - Match the type with specification
 */
const textTransformPropertyDataSchema = z.array(z.literal('uppercase'))
export type TextTransformPropertyData = z.infer<
  typeof textTransformPropertyDataSchema
>

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-style
 *
 * @todos
 * - Match the type with specification
 */
const fontStylePropertyDataSchema = z.array(z.literal('italic'))
export type FontStylePropertyData = z.infer<typeof fontStylePropertyDataSchema>

/**
 * @todos
 * - Remove `null` from possible values of longhand properties
 * - Remove `undefined` from possible values and make fields optional
 */

export const textStylePropertyDataSchema = z.object({
  fontFamily: fontFamilyPropertyDataSchema.optional().nullable(),
  letterSpacing: letterSpacingPropertyDataSchema.optional().nullable(),
  fontSize: fontSizePropertyDataSchema.optional().nullable(),
  fontWeight: fontWeightPropertyDataSchema.optional().nullable(),
  textTransform: textTransformPropertyDataSchema,
  fontStyle: fontStylePropertyDataSchema,
})

export type TextStylePropertyData = z.infer<typeof textStylePropertyDataSchema>

/**
 * Primitives like `string` and `number` are excluded from the style data because the relevant
 * panels from the Makeswift builder were originally implemented only to support object values, and
 * not CSS strings. For example, 100 pixels would be `{ value: 100, unit: 'px' }` but never `100` or
 * `'100px'`.
 */

export const widthDataSchema = z.union([
  pixelLengthData,
  percentageLengthData,
  z.literal('auto'),
])

const marginSchema = z
  .union([pixelLengthData, z.literal('auto')])
  .nullable()
  .optional()

export const marginDataSchema = z.object({
  marginTop: marginSchema,
  marginRight: marginSchema,
  marginBottom: marginSchema,
  marginLeft: marginSchema,
})

const paddingSchema = z
  .union([pixelLengthData, z.literal('auto')])
  .nullable()
  .optional()

export const paddingDataSchema = z.object({
  paddingTop: paddingSchema,
  paddingRight: paddingSchema,
  paddingBottom: paddingSchema,
  paddingLeft: paddingSchema,
})

const borderRadiusSchema = z
  .union([pixelLengthData, percentageLengthData])
  .nullable()
  .optional()

export const borderRadiusDataSchema = z.object({
  borderTopLeftRadius: borderRadiusSchema,
  borderTopRightRadius: borderRadiusSchema,
  borderBottomRightRadius: borderRadiusSchema,
  borderBottomLeftRadius: borderRadiusSchema,
})
