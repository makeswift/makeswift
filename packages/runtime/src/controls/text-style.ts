/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-family
 *
 * @todos
 * - Remove `null` from possible values of longhand properties
 * - Remove `undefined` from possible values and make fields optional
 */
export type FontFamilyPropertyData = string | null | undefined

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing
 *
 * @todos
 * - Remove `null` from possible values of longhand properties
 * - Remove `undefined` from possible values and make fields optional
 */
export type LetterSpacingPropertyData = number | null | undefined

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-size
 *
 * @todos
 * - Remove `null` from possible values of longhand properties
 * - Remove `undefined` from possible values and make fields optional
 */
export type FontSizePropertyData =
  | {
      value: number
      unit: 'px'
    }
  | null
  | undefined

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight
 *
 * @todos
 * - Remove `null` from possible values of longhand properties
 * - Remove `undefined` from possible values and make fields optional
 */
export type FontWeightPropertyData = number | null | undefined

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform
 *
 * @todos
 * - Match the type with specification
 */
export type TextTransformPropertyData = 'uppercase'[]

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-style
 *
 * @todos
 * - Match the type with specification
 */
export type FontStylePropertyData = 'italic'[]

/**
 * @todos
 * - Remove `null` from possible values of longhand properties
 * - Remove `undefined` from possible values and make fields optional
 */
export type TextStyleControlData = {
  fontFamily?: FontFamilyPropertyData | null | undefined
  letterSpacing: LetterSpacingPropertyData | null | undefined
  fontSize: FontSizePropertyData | null | undefined
  fontWeight: FontWeightPropertyData | null | undefined
  textTransform: TextTransformPropertyData
  fontStyle: FontStylePropertyData
}

export const TextStyleControlType = 'makeswift::controls::text-style'

type TextStyleControlConfig = {
  label?: string
  defaultValue?: Partial<TextStyleControlData>
}

export type TextStyleControlDefinition<C extends TextStyleControlConfig = TextStyleControlConfig> =
  {
    type: typeof TextStyleControlType
    config: C
  }

export function TextStyle<C extends TextStyleControlConfig>(
  config: C = {} as C,
): TextStyleControlDefinition<C> {
  return { type: TextStyleControlType, config }
}
