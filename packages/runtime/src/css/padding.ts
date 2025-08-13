import { type CSSObject } from '@emotion/serialize'
import { LengthData, lengthDataToString } from './length'
import {
  PaddingTopProperty,
  PaddingRightProperty,
  PaddingBottomProperty,
  PaddingLeftProperty,
} from 'csstype'

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
  paddingTop: PaddingLonghandPropertyData | PaddingTopProperty<number | string> | null | undefined
  paddingRight:
    | PaddingLonghandPropertyData
    | PaddingRightProperty<number | string>
    | null
    | undefined
  paddingBottom:
    | PaddingLonghandPropertyData
    | PaddingBottomProperty<number | string>
    | null
    | undefined
  paddingLeft: PaddingLonghandPropertyData | PaddingLeftProperty<number | string> | null | undefined
}

export function paddingPropertyDataToStyle(
  data: PaddingPropertyData,
  defaultValue: PaddingPropertyData = {} as PaddingPropertyData,
): CSSObject {
  const paddingTop = data.paddingTop ?? defaultValue.paddingTop
  const paddingRight = data.paddingRight ?? defaultValue.paddingRight
  const paddingBottom = data.paddingBottom ?? defaultValue.paddingBottom
  const paddingLeft = data.paddingLeft ?? defaultValue.paddingLeft
  const style: CSSObject = {}

  if (paddingTop != null) style.paddingTop = lengthDataToString(paddingTop)
  if (paddingRight != null) style.paddingRight = lengthDataToString(paddingRight)
  if (paddingBottom != null) style.paddingBottom = lengthDataToString(paddingBottom)
  if (paddingLeft != null) style.paddingLeft = lengthDataToString(paddingLeft)

  return style
}
