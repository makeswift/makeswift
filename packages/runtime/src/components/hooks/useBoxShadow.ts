import { useQuery } from '@apollo/client'

import { isNonNullable } from '../utils/isNonNullable'
import type { ColorValue as Color } from '../utils/types'
import { SWATCHES_BY_ID } from '../utils/queries'
import type { ResponsiveValue } from '../../prop-controllers'
import type { ShadowsValue as ResponsiveShadowsValue } from '../../prop-controllers/descriptors'

type ShadowData = {
  id: string
  payload: {
    inset: boolean
    offsetX: number
    offsetY: number
    blurRadius: number
    spreadRadius: number
    color: Color | null | undefined
  }
}

const ShadowDefaultValue = {
  inset: false,
  offsetX: 0,
  offsetY: 2,
  blurRadius: 4,
  spreadRadius: 0,
  color: null,
} as const

export type BoxShadowData = Array<ShadowData>

export type BoxShadowPropControllerData = ResponsiveValue<BoxShadowData>

export function useBoxShadow(
  value: ResponsiveShadowsValue | null | undefined,
): BoxShadowPropControllerData | null | undefined {
  const swatchIds =
    value == null
      ? []
      : [
          ...Array.from(
            new Set(
              value
                .map(({ value: shadows }) =>
                  shadows.map(({ payload: { color } }) => color && color.swatchId),
                )
                .reduce((a, b) => a.concat(b), [])
                .filter(isNonNullable),
            ),
          ),
        ]

  const skip = value == null || swatchIds.length === 0
  const { error, data = {} } = useQuery(SWATCHES_BY_ID, { skip, variables: { ids: swatchIds } })

  if (value == null || error != null) return null

  const { swatches = [] } = data

  return value.map(({ value: shadows, ...restOfValue }) => ({
    ...restOfValue,
    value: shadows.map(
      ({
        payload: { color, inset, offsetX, offsetY, blurRadius, spreadRadius },
        ...restOfShadow
      }) => ({
        ...restOfShadow,
        payload: {
          color:
            color != null
              ? {
                  swatch: swatches.find((s: any) => s && s.id === color.swatchId),
                  alpha: color.alpha,
                }
              : null,
          inset: inset ?? ShadowDefaultValue.inset,
          offsetX: offsetX ?? ShadowDefaultValue.offsetX,
          offsetY: offsetY ?? ShadowDefaultValue.offsetY,
          blurRadius: blurRadius ?? ShadowDefaultValue.blurRadius,
          spreadRadius: spreadRadius ?? ShadowDefaultValue.spreadRadius,
        },
      }),
    ),
  }))
}
