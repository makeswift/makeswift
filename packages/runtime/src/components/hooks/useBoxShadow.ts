import { isNonNullable } from '../utils/isNonNullable'
import type { ColorValue as Color } from '../utils/types'
import { type ResponsiveValue } from '@makeswift/controls'
import { useSwatches } from '../../runtimes/react/hooks/makeswift-api'
import {
  ShadowsPropControllerData,
  getShadowsPropControllerDataResponsiveShadowsData,
  getShadowsPropControllerDataSwatchIds,
} from '@makeswift/prop-controllers'

type ShadowValue = {
  inset: boolean
  offsetX: number
  offsetY: number
  blurRadius: number
  spreadRadius: number
  color: Color | null | undefined
}

const ShadowDefaultValue: ShadowValue = {
  inset: false,
  offsetX: 0,
  offsetY: 2,
  blurRadius: 4,
  spreadRadius: 0,
  color: null,
} as const

export type BoxShadow = { id: string; payload: ShadowValue }[]

export type ResponsiveBoxShadow = ResponsiveValue<BoxShadow>

export function useBoxShadow(
  data: ShadowsPropControllerData | null | undefined,
): ResponsiveBoxShadow | null | undefined {
  const swatchIds = getShadowsPropControllerDataSwatchIds(data)
  const swatches = useSwatches(swatchIds)
  const responsiveShadowsData = getShadowsPropControllerDataResponsiveShadowsData(data)

  if (responsiveShadowsData == null) return null

  return responsiveShadowsData.map(({ value: shadows, ...restOfValue }) => ({
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
                  swatch: swatches.filter(isNonNullable).find(s => s && s.id === color.swatchId),
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
