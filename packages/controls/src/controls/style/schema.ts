import { z } from 'zod'

import { Schema } from '../../common'

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/length
 *
 * @todos
 * - Add additional units
 * - Rename `value` field to `amount` or a more descriptive name representative of the "distance"
 *   represented by a CSS length
 */
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
      color: color.nullable().optional(),
    })
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
      borderTop: borderSideSchema(color).nullable().optional(),
      borderRight: borderSideSchema(color).nullable().optional(),
      borderBottom: borderSideSchema(color).nullable().optional(),
      borderLeft: borderSideSchema(color).nullable().optional(),
    })
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
    fontFamily: fontFamily.nullable().optional(),
    letterSpacing: letterSpacing.nullable().optional(),
    fontSize: fontSize.nullable().optional(),
    fontWeight: fontWeight.nullable().optional(),
    textTransform,
    fontStyle,
  })
  .transform((v) => ({
    ...v,
    letterSpacing: v.letterSpacing,
    fontWeight: v.fontWeight,
    fontSize: v.fontSize,
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
