import {
  type ResponsiveValue,
  type ResponsiveColorData,
  getResponsiveColorDataSwatchIds,
} from '@makeswift/prop-controllers'

import { isNonNullable } from '../utils/isNonNullable'
import type { ColorValue as Color } from '../utils/types'
import { resolveColor } from '../utils/resolveColor'
import { useSwatches } from '../../runtimes/react/hooks/makeswift-api'

export function useResponsiveColor(
  color: ResponsiveColorData | null | undefined,
): ResponsiveValue<Color> | null | undefined {
  const swatchIds = color == null ? [] : getResponsiveColorDataSwatchIds(color)
  const swatches = useSwatches(swatchIds)

  if (color == null) return null

  return color
    .map(({ value: v, ...rest }) => {
      const value = resolveColor(v, swatches)

      // an override whose swatch can't be found isn't rendered
      return value.swatch == null ? null : { ...rest, value }
    })
    .filter(isNonNullable)
}
