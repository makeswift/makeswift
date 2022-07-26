import { ColorData, ResponsiveValue } from './types'

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/length
 *
 * @todos
 * - Add additional units
 * - Rename `value` field to `amount` or a more descriptive name representative of the "distance"
 *   represented by a CSS length
 */
export type LengthData = { value: number; unit: 'px' }

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/percentage */
export type PercentageData = { value: number; unit: '%' }

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/length-percentage */
export type LengthPercentageData = LengthData | PercentageData

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/width */
export type WidthPropertyData = LengthPercentageData

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin#constituent_properties */
export type MarginLonghandPropertyData = LengthData | 'auto'

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin
 *
 * @todos
 * - Remove `null` from possible values
 * - Remove `undefined` from possible values and make fields optional
 */
export type MarginPropertyData = {
  marginTop: MarginLonghandPropertyData | null | undefined
  marginRight: MarginLonghandPropertyData | null | undefined
  marginBottom: MarginLonghandPropertyData | null | undefined
  marginLeft: MarginLonghandPropertyData | null | undefined
}

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding#constituent_properties */
export type PaddingLonghandPropertyData = LengthData

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding
 *
 * @todos
 * - Remove `null` from possible values
 * - Remove `undefined` from possible values and make fields optional
 */
export type PaddingPropertyData = {
  paddingTop: PaddingLonghandPropertyData | null | undefined
  paddingRight: PaddingLonghandPropertyData | null | undefined
  paddingBottom: PaddingLonghandPropertyData | null | undefined
  paddingLeft: PaddingLonghandPropertyData | null | undefined
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/border-style
 */
type BorderStyle = 'dotted' | 'dashed' | 'solid'

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/border-top#constituent_properties
 *
 * @todos
 * - Change `width` to be a `Length`
 * - Remove `null` from possible values
 * - Remove `undefined` from possible values and make fields optional
 */
export type BorderSideShorthandPropertyData = {
  width: number | null | undefined
  style: BorderStyle
  color?: ColorData | null
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/border
 *
 * @todos
 * - Remove `null` from possible values
 * - Remove `undefined` from possible values and make fields optional
 */
export type BorderPropertyData = {
  borderTop: BorderSideShorthandPropertyData | null | undefined
  borderRight: BorderSideShorthandPropertyData | null | undefined
  borderBottom: BorderSideShorthandPropertyData | null | undefined
  borderLeft: BorderSideShorthandPropertyData | null | undefined
}

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius#constituent_properties */
export type BorderRadiusLonghandPropertyData = LengthPercentageData

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius
 *
 * @todos
 * - Remove `null` from possible values of longhand properties
 * - Remove `undefined` from possible values and make fields optional
 */
export type BorderRadiusPropertyData = {
  borderTopLeftRadius: LengthPercentageData | null | undefined
  borderTopRightRadius: LengthPercentageData | null | undefined
  borderBottomRightRadius: LengthPercentageData | null | undefined
  borderBottomLeftRadius: LengthPercentageData | null | undefined
}

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
export type TextStylePropertyData = {
  fontFamily?: FontFamilyPropertyData | null | undefined
  letterSpacing: LetterSpacingPropertyData | null | undefined
  fontSize: FontSizePropertyData | null | undefined
  fontWeight: FontWeightPropertyData | null | undefined
  textTransform: TextTransformPropertyData
  fontStyle: FontStylePropertyData
}

export type StyleControlData = {
  width?: ResponsiveValue<WidthPropertyData>
  margin?: ResponsiveValue<MarginPropertyData>
  padding?: ResponsiveValue<PaddingPropertyData>
  border?: ResponsiveValue<BorderPropertyData>
  borderRadius?: ResponsiveValue<BorderRadiusPropertyData>
  textStyle?: ResponsiveValue<TextStylePropertyData>
}

export const StyleControlType = 'makeswift::controls::style'

export const StyleControlProperty = {
  Width: 'makeswift::controls::style::property::width',
  Margin: 'makeswift::controls::style::property::margin',
  Padding: 'makeswift::controls::style::property::padding',
  Border: 'makeswift::controls::style::property::border',
  BorderRadius: 'makeswift::controls::style::property::border-radius',
  TextStyle: 'makeswift::controls::style::property::text-style',
} as const

export type StyleControlProperty = typeof StyleControlProperty[keyof typeof StyleControlProperty]

type StyleControlParams = { properties?: StyleControlProperty[] }

export type StyleControlConfig = { properties: StyleControlProperty[] }

const StyleControlDefaultProperties: StyleControlProperty[] = [
  StyleControlProperty.Width,
  StyleControlProperty.Margin,
]

const AllStyleControlProperties: StyleControlProperty[] = [
  StyleControlProperty.Width,
  StyleControlProperty.Margin,
  StyleControlProperty.Padding,
  StyleControlProperty.Border,
  StyleControlProperty.BorderRadius,
  StyleControlProperty.TextStyle,
]

export type StyleControlDefinition = {
  type: typeof StyleControlType
  config: StyleControlConfig
}

/**
 * @todos
 * - Add support for custom panel labels.
 * - Add support for default values. Internally, default values must be represented with the same
 * format as the underlying data so that controls can show these values.
 */
export function Style(params?: StyleControlParams): StyleControlDefinition {
  return {
    type: StyleControlType,
    config: { properties: params?.properties ?? StyleControlDefaultProperties },
  }
}

Style.Default = StyleControlDefaultProperties
Style.All = AllStyleControlProperties

Style.Width = StyleControlProperty.Width
Style.Margin = StyleControlProperty.Margin
Style.Padding = StyleControlProperty.Padding
Style.Border = StyleControlProperty.Border
Style.BorderRadius = StyleControlProperty.BorderRadius
Style.TextStyle = StyleControlProperty.TextStyle
