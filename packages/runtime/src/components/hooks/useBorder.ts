import { BorderStyleProperty } from 'csstype'

import { isNonNullable } from '../utils/isNonNullable'
import { SWATCHES_BY_ID } from '../utils/queries'
import type { ColorValue as Color } from '../utils/types'
import { ResponsiveValue } from '../../prop-controllers'
import { BorderValue as ResponsiveBorderValue } from '../../prop-controllers/descriptors'
import { useQuery } from '../../api/react'

function mapSideColor(swatches: any, { color, ...restOfSide }: any) {
  return {
    ...restOfSide,
    color: color && {
      alpha: color.alpha,
      swatch: swatches.find((s: any) => s && s.id === color.swatchId),
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
  value: ResponsiveBorderValue | null | undefined,
): BorderPropControllerData | null | undefined {
  const swatchIds =
    value == null
      ? []
      : [
          ...Array.from(
            new Set(
              value
                .map(({ value: { borderTop, borderLeft, borderBottom, borderRight } }) => [
                  borderTop && borderTop.color && borderTop.color.swatchId,
                  borderBottom && borderBottom.color && borderBottom.color.swatchId,
                  borderLeft && borderLeft.color && borderLeft.color.swatchId,
                  borderRight && borderRight.color && borderRight.color.swatchId,
                ])
                .reduce((a, b) => a.concat(b))
                .filter(isNonNullable),
            ),
          ),
        ]
  const skip = value == null || swatchIds.length === 0
  const { error, data = {} } = useQuery(SWATCHES_BY_ID, { skip, variables: { ids: swatchIds } })

  if (value == null || error != null) return null

  const { swatches = [] } = data

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
