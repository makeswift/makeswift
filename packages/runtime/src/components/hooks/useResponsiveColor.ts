import {
  type ResponsiveValue,
  type ResponsiveColorData,
  getResponsiveColorDataSwatchIds,
} from '@makeswift/prop-controllers'

import { isNonNullable } from '../utils/isNonNullable'
import type { ColorValue as Color } from '../utils/types'
import { useSwatches } from '../../runtimes/react/hooks/makeswift-api'

export function useResponsiveColor(
  color: ResponsiveColorData | null | undefined,
): ResponsiveValue<Color> | null | undefined {
  const swatchIds = color == null ? [] : getResponsiveColorDataSwatchIds(color)
  const swatches = useSwatches(swatchIds)

  if (color == null) return null

  return color
    .map(({ value: v, ...rest }) => {
      const { swatchId, alpha } = v
      const swatch = swatches.find(s => s && s.id === swatchId)

      return swatch == null ? null : { ...rest, value: { swatch, alpha } }
    })
    .filter(isNonNullable)
}
