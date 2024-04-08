import { BorderStyleProperty } from 'csstype'

import type { ColorValue as Color } from '../utils/types'
import { ResponsiveValue } from '../../prop-controllers'
import {
  ResponsiveBorderData,
  BorderSideData,
  getBorderPropControllerDataSwatchIds,
} from '@makeswift/prop-controllers'
import { useSwatches } from '../../runtimes/react/hooks/makeswift-api'
import { Swatch } from '../../api'
import { isNonNullable } from '../utils/isNonNullable'

function mapSideColor(swatches: (Swatch | null)[], { color, ...restOfSide }: BorderSideData) {
  return {
    ...restOfSide,
    color: color && {
      alpha: color.alpha,
      swatch: swatches.filter(isNonNullable).find(s => s && s.id === color.swatchId),
    },
  }
}

export type BorderSide = {
  width: number | null | undefined
  style: BorderStyleProperty
  color: Color | null | undefined
}

type BorderData = {
  borderTop: BorderSide | null | undefined
  borderRight: BorderSide | null | undefined
  borderBottom: BorderSide | null | undefined
  borderLeft: BorderSide | null | undefined
}

export type BorderPropControllerData = ResponsiveValue<BorderData>

export function useBorder(
  value: ResponsiveBorderData | undefined,
): BorderPropControllerData | undefined {
  const swatchIds = getBorderPropControllerDataSwatchIds(value)
  const swatches = useSwatches(swatchIds)

  if (value == null) return undefined

  return value.map(({ value: { borderTop, borderBottom, borderLeft, borderRight }, ...rest }) => ({
    ...rest,
    value: {
      borderTop: borderTop && mapSideColor(swatches, borderTop),
      borderBottom: borderBottom && mapSideColor(swatches, borderBottom),
      borderLeft: borderLeft && mapSideColor(swatches, borderLeft),
      borderRight: borderRight && mapSideColor(swatches, borderRight),
    },
  }))
}
