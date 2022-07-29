import type { LengthPercentageData } from '../css/length-percentage'
import { MarginPropertyData } from '../css/margin'
import { PaddingPropertyData } from '../css/padding'
import { ColorData, ResponsiveValue } from './types'
import { CopyContext, ReplacementContext } from '../state/react-page'
import { copyColorData } from './color'

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/width */
export type WidthPropertyData = LengthPercentageData

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

export function copyStyleData(
  value: StyleControlData | undefined,
  context: CopyContext,
): StyleControlData | undefined {
  if (value == null) return value

  function copyResponsiveBorder(
    responsiveBorder: ResponsiveValue<BorderPropertyData> | undefined,
  ): ResponsiveValue<BorderPropertyData> | undefined {
    if (responsiveBorder == null) return undefined
    return responsiveBorder.map(deviceBorder => ({
      ...deviceBorder,
      value: copyBorder(deviceBorder.value),
    }))
  }

  function copyBorder(border: BorderPropertyData): BorderPropertyData {
    function copyBorderSide(side: BorderSideShorthandPropertyData | null | undefined) {
      if (side == null) return null

      if (side.color == null) return side

      return {
        ...side,
        color: copyColorData(side.color, context),
      }
    }

    return {
      borderTop: copyBorderSide(border.borderTop),
      borderBottom: copyBorderSide(border.borderBottom),
      borderRight: copyBorderSide(border.borderRight),
      borderLeft: copyBorderSide(border.borderLeft),
    }
  }

  return { ...value, border: copyResponsiveBorder(value.border) }
}

if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest

  describe.concurrent('style copy', () => {
    test('colors are replaced', () => {
      // Arrange
      const value: StyleControlData = {
        width: [
          {
            value: {
              unit: 'px',
              value: 100,
            },
            deviceId: 'desktop',
          },
        ],
        border: [
          {
            value: {
              borderTop: {
                color: {
                  alpha: 1,
                  swatchId: 'U3dhdGNoOmJjMDkwZWJjLTZkZDUtNDY1NS1hMDY0LTg3ZDAxM2U4YTFhNA==',
                },
                style: 'solid',
                width: 9,
              },
              borderLeft: {
                color: {
                  alpha: 1,
                  swatchId: 'U3dhdGNoOmJjMDkwZWJjLTZkZDUtNDY1NS1hMDY0LTg3ZDAxM2U4YTFhNA==',
                },
                style: 'solid',
                width: 9,
              },
              borderRight: {
                color: {
                  alpha: 1,
                  swatchId: 'U3dhdGNoOmJjMDkwZWJjLTZkZDUtNDY1NS1hMDY0LTg3ZDAxM2U4YTFhNA==',
                },
                style: 'solid',
                width: 9,
              },
              borderBottom: {
                color: {
                  alpha: 1,
                  swatchId: 'U3dhdGNoOmJjMDkwZWJjLTZkZDUtNDY1NS1hMDY0LTg3ZDAxM2U4YTFhNA==',
                },
                style: 'solid',
                width: 9,
              },
            },
            deviceId: 'desktop',
          },
        ],
        textStyle: [
          {
            value: {
              fontSize: {
                unit: 'px',
                value: 46,
              },
              fontStyle: [],
              fontFamily: 'Oswald',
              fontWeight: 400,
              letterSpacing: 5.2,
              textTransform: [],
            },
            deviceId: 'desktop',
          },
        ],
        borderRadius: [
          {
            value: {
              borderTopLeftRadius: {
                unit: 'px',
                value: 4,
              },
              borderTopRightRadius: {
                unit: 'px',
                value: 4,
              },
              borderBottomLeftRadius: {
                unit: 'px',
                value: 4,
              },
              borderBottomRightRadius: {
                unit: 'px',
                value: 4,
              },
            },
            deviceId: 'desktop',
          },
        ],
      }
      const expected = JSON.parse(
        JSON.stringify(value).replaceAll(
          'U3dhdGNoOmJjMDkwZWJjLTZkZDUtNDY1NS1hMDY0LTg3ZDAxM2U4YTFhNA==',
          'testing',
        ),
      )

      const replacementContext = {
        elementHtmlIds: new Set(),
        elementKeys: new Map(),
        swatchIds: new Map([
          ['U3dhdGNoOmJjMDkwZWJjLTZkZDUtNDY1NS1hMDY0LTg3ZDAxM2U4YTFhNA==', 'testing'],
        ]),
        fileIds: new Map(),
        typographyIds: new Map(),
        tableIds: new Map(),
        tableColumnIds: new Map(),
        pageIds: new Map(),
        globalElementIds: new Map(),
        globalElementData: new Map(),
      }

      // Act
      const result = copyStyleData(value, {
        replacementContext: replacementContext as ReplacementContext,
        copyElement: node => node,
      })

      // Assert
      expect(result).toMatchObject(expected)
    })
  })
}
