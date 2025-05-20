import { CSSObject } from '@emotion/serialize'
import {
  BorderTopLeftRadiusProperty,
  BorderTopRightRadiusProperty,
  BorderBottomRightRadiusProperty,
  BorderBottomLeftRadiusProperty,
} from 'csstype'
import { LengthPercentageData, lengthPercentageDataToString } from './length-percentage'

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
  borderTopLeftRadius?:
    | LengthPercentageData
    | BorderTopLeftRadiusProperty<string | number>
    | null
    | undefined
  borderTopRightRadius?:
    | LengthPercentageData
    | BorderTopRightRadiusProperty<string | number>
    | null
    | undefined
  borderBottomRightRadius?:
    | LengthPercentageData
    | BorderBottomRightRadiusProperty<string | number>
    | null
    | undefined
  borderBottomLeftRadius?:
    | LengthPercentageData
    | BorderBottomLeftRadiusProperty<string | number>
    | null
    | undefined
}

export function borderRadiusPropertyDataToStyle(
  data: BorderRadiusPropertyData,
  defaultValue: BorderRadiusPropertyData = {},
): CSSObject {
  const borderTopLeftRadius = data.borderTopLeftRadius ?? defaultValue.borderTopLeftRadius
  const borderTopRightRadius = data.borderTopRightRadius ?? defaultValue.borderTopRightRadius
  const borderBottomRightRadius =
    data.borderBottomRightRadius ?? defaultValue.borderBottomRightRadius
  const borderBottomLeftRadius = data.borderBottomLeftRadius ?? defaultValue.borderBottomLeftRadius
  const style: CSSObject = {}

  if (borderTopLeftRadius != null) {
    style.borderTopLeftRadius = lengthPercentageDataToString(borderTopLeftRadius)
  }

  if (borderTopRightRadius != null) {
    style.borderTopRightRadius = lengthPercentageDataToString(borderTopRightRadius)
  }

  if (borderBottomRightRadius != null) {
    style.borderBottomRightRadius = lengthPercentageDataToString(borderBottomRightRadius)
  }

  if (borderBottomLeftRadius != null) {
    style.borderBottomLeftRadius = lengthPercentageDataToString(borderBottomLeftRadius)
  }

  return style
}
