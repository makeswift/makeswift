import { type CSSObject } from '@emotion/serialize'
import {
  BorderBottomProperty,
  BorderLeftProperty,
  BorderProperty,
  BorderRightProperty,
  BorderStyleProperty,
  BorderTopProperty,
} from 'csstype'
import { colorToString } from '../components/utils/colorToString'
import { ColorValue } from '../components/utils/types'

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/border-top#constituent_properties
 *
 * @todos
 * - Change `width` to be a `Length`
 * - Remove `null` from possible values
 * - Remove `undefined` from possible values and make fields optional
 */
export type BorderSideShorthandPropertyData = {
  width?: number | null | undefined
  style: BorderStyleProperty
  color?: ColorValue | null
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/border
 *
 * @todos
 * - Remove `null` from possible values
 * - Remove `undefined` from possible values and make fields optional
 */
export type BorderPropertyData = {
  borderTop?:
    | BorderSideShorthandPropertyData
    | BorderTopProperty<string | number>
    | null
    | undefined
  borderRight?:
    | BorderSideShorthandPropertyData
    | BorderRightProperty<string | number>
    | null
    | undefined
  borderBottom?:
    | BorderSideShorthandPropertyData
    | BorderBottomProperty<string | number>
    | null
    | undefined
  borderLeft?:
    | BorderSideShorthandPropertyData
    | BorderLeftProperty<string | number>
    | null
    | undefined
}

export function borderPropertyDataToStyle(
  data: BorderPropertyData,
  defaultValue: BorderPropertyData = {},
): CSSObject {
  const borderTop = data.borderTop ?? defaultValue.borderTop
  const borderRight = data.borderRight ?? defaultValue.borderRight
  const borderBottom = data.borderBottom ?? defaultValue.borderBottom
  const borderLeft = data.borderLeft ?? defaultValue.borderLeft
  const style: CSSObject = {}

  if (borderTop != null) style.borderTop = borderSideToString(borderTop)
  if (borderRight != null) style.borderRight = borderSideToString(borderRight)
  if (borderBottom != null) style.borderBottom = borderSideToString(borderBottom)
  if (borderLeft != null) style.borderLeft = borderSideToString(borderLeft)

  return style
}

function borderSideToString(
  borderSide: BorderSideShorthandPropertyData | BorderProperty<string | number>,
): string {
  if (typeof borderSide === 'string') return borderSide

  if (typeof borderSide === 'number') return `${borderSide}px`

  const { width, color, style } = borderSide

  return `${width != null ? width : 0}px ${style} ${color != null ? colorToString(color) : 'black'}`
}
