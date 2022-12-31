import { isNonNullable } from '../utils/isNonNullable'
import type { ColorValue as Color } from '../utils/types'
import type { ResponsiveValue } from '../../prop-controllers'
import type { ShadowsValue as ResponsiveShadowsValue } from '../../prop-controllers/descriptors'
import { getBoxShadowsSwatchIds } from '../../prop-controllers/introspection'
import { useSwatches } from '../../runtimes/react/hooks/makeswift-api'

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
  const swatchIds = getBoxShadowsSwatchIds(value)
  const swatches = useSwatches(swatchIds)

  if (value == null) return null

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
