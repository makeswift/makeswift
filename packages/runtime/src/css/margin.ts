import { CSSObject } from '@emotion/css'
import {
  MarginBottomProperty,
  MarginLeftProperty,
  MarginRightProperty,
  MarginTopProperty,
} from 'csstype'
import { LengthData, lengthDataToString } from './length'

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
  marginTop: MarginLonghandPropertyData | MarginTopProperty<string | number> | null | undefined
  marginRight: MarginLonghandPropertyData | MarginRightProperty<string | number> | null | undefined
  marginBottom:
    | MarginLonghandPropertyData
    | MarginBottomProperty<string | number>
    | null
    | undefined
  marginLeft: MarginLonghandPropertyData | MarginLeftProperty<string | number> | null | undefined
}

export function marginPropertyDataToStyle(
  data: MarginPropertyData,
  defaultValue: MarginPropertyData = {} as MarginPropertyData,
): CSSObject {
  const marginTop = data.marginTop ?? defaultValue.marginTop
  const marginRight = data.marginRight ?? defaultValue.marginRight
  const marginBottom = data.marginBottom ?? defaultValue.marginBottom
  const marginLeft = data.marginLeft ?? defaultValue.marginLeft
  const style: CSSObject = {}

  if (marginTop) style.marginTop = lengthDataToString(marginTop)
  if (marginRight) style.marginRight = lengthDataToString(marginRight)
  if (marginBottom) style.marginBottom = lengthDataToString(marginBottom)
  if (marginLeft) style.marginLeft = lengthDataToString(marginLeft)

  return style
}
