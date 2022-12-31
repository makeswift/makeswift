import type { ResponsiveValue } from '../../prop-controllers'
import { isNonNullable } from '../utils/isNonNullable'
import type { ColorValue as Color } from '../utils/types'
import { getResponsiveColorSwatchIds } from '../../prop-controllers/introspection'
import { useSwatches } from '../../runtimes/react/hooks/makeswift-api'

export function useResponsiveColor(
  color:
    | ResponsiveValue<{
        swatchId: string
        alpha: number
      }>
    | null
    | undefined,
): ResponsiveValue<Color> | null | undefined {
  const swatchIds = getResponsiveColorSwatchIds(color)
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
