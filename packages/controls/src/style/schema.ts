import { z } from 'zod'
import { Schema } from '../common'

// TODO: @arvin this file and many of the types are copied from the dependencies
// of the original runtime style control, but converted to schemas for parsing
// in the Style definition. Leaving note to revisit and see where these
// types/schemas should live.

export const pixelLength = z.object({
  value: z.number(),
  unit: z.literal('px'),
})

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/percentage
 */
export const percentageLength = z.object({
  value: z.number(),
  unit: z.literal('%'),
})

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/border-style
 */
export const borderStyle = z.enum(['dotted', 'dashed', 'solid'])

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/border-top#constituent_properties
 *
 * @todos
 * - Change `width` to be a `Length`
 * - Remove `null` from possible values
 * - Remove `undefined` from possible values and make fields optional
 */

export const borderSideSchema = <C extends z.ZodTypeAny>(color: C) =>
  z
    .object({
      width: z.number().nullable().optional(),
      style: borderStyle,
      color: color.optional().nullable(),
    })
    // FIXME: REVIEW
    .transform((v) => ({
      ...v,
      width: v.width,
    }))

export const borderSide = borderSideSchema(Schema.colorData)

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/border
 *
 * @todos
 * - Remove `null` from possible values
 * - Remove `undefined` from possible values and make fields optional
 */

export const borderSchema = <C extends z.ZodTypeAny>(color: C) =>
  z
    .object({
      borderTop: borderSideSchema(color).optional().nullable(),
      borderRight: borderSideSchema(color).optional().nullable(),
      borderBottom: borderSideSchema(color).optional().nullable(),
      borderLeft: borderSideSchema(color).optional().nullable(),
    })
    // FIXME: REVIEW
    .transform((v) => ({
      borderTop: v.borderTop,
      borderRight: v.borderRight,
      borderBottom: v.borderBottom,
      borderLeft: v.borderLeft,
    }))

export const border = borderSchema(Schema.colorData)

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-family
 *
 * @todos
 * - Remove `null` from possible values of longhand properties
 * - Remove `undefined` from possible values and make fields optional
 */
export const fontFamily = z.string().nullable().optional()

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing
 *
 * @todos
 * - Remove `null` from possible values of longhand properties
 * - Remove `undefined` from possible values and make fields optional
 */
export const letterSpacing = z.number().nullable().optional()

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-size
 *
 * @todos
 * - Remove `null` from possible values of longhand properties
 * - Remove `undefined` from possible values and make fields optional
 */
export const fontSize = z
  .object({
    value: z.number(),
    unit: z.literal('px'),
  })
  .nullable()
  .optional()

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight
 *
 * @todos
 * - Remove `null` from possible values of longhand properties
 * - Remove `undefined` from possible values and make fields optional
 */
export const fontWeight = z.number().nullable().optional()

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform
 *
 * @todos
 * - Match the type with specification
 */
export const textTransform = z.array(z.literal('uppercase'))

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-style
 *
 * @todos
 * - Match the type with specification
 */
export const fontStyle = z.array(z.literal('italic'))

/**
 * @todos
 * - Remove `null` from possible values of longhand properties
 * - Remove `undefined` from possible values and make fields optional
 */

export const textStyle = z
  .object({
    fontFamily: fontFamily.optional().nullable(),
    letterSpacing: letterSpacing.optional().nullable(),
    fontSize: fontSize.optional().nullable(),
    fontWeight: fontWeight.optional().nullable(),
    textTransform,
    fontStyle,
  })
  // FIXME: REVIEW
  .transform((v) => ({
    ...v,
    fontWeight: v.fontWeight,
    fontSize: v.fontSize,
    letterSpacing: v.letterSpacing,
  }))

/**
 * Primitives like `string` and `number` are excluded from the style data because the relevant
 * panels from the Makeswift builder were originally implemented only to support object values, and
 * not CSS strings. For example, 100 pixels would be `{ value: 100, unit: 'px' }` but never `100` or
 * `'100px'`.
 */

export const width = z.union([pixelLength, percentageLength])

const marginValue = z
  .union([pixelLength, z.literal('auto')])
  .nullable()
  .optional()

export const margin = z
  .object({
    marginTop: marginValue,
    marginRight: marginValue,
    marginBottom: marginValue,
    marginLeft: marginValue,
  })
  // FIXME: REVIEW
  .transform((v) => ({
    ...v,
    marginTop: v.marginTop,
    marginRight: v.marginRight,
    marginBottom: v.marginBottom,
    marginLeft: v.marginLeft,
  }))

const paddingValue = pixelLength.nullable().optional()

export const padding = z
  .object({
    paddingTop: paddingValue,
    paddingRight: paddingValue,
    paddingBottom: paddingValue,
    paddingLeft: paddingValue,
  })
  // FIXME: REVIEW
  .transform((v) => ({
    ...v,
    paddingTop: v.paddingTop,
    paddingRight: v.paddingRight,
    paddingBottom: v.paddingBottom,
    paddingLeft: v.paddingLeft,
  }))

const borderRadiusValue = z
  .union([pixelLength, percentageLength])
  .nullable()
  .optional()

export const borderRadius = z.object({
  borderTopLeftRadius: borderRadiusValue,
  borderTopRightRadius: borderRadiusValue,
  borderBottomRightRadius: borderRadiusValue,
  borderBottomLeftRadius: borderRadiusValue,
})
