import { useQuery } from '@apollo/client'

import type { ResponsiveValue } from '../../prop-controllers'
import { SWATCHES_BY_ID } from '../utils/queries'
import { isNonNullable } from '../utils/isNonNullable'
import type { ColorValue as Color } from '../utils/types'

export function useColor(
  color:
    | ResponsiveValue<{
        swatchId: string
        alpha: number
      }>
    | null
    | undefined,
): ResponsiveValue<Color> | null | undefined {
  const swatchIds =
    color == null
      ? []
      : [...Array.from(new Set(color.map(({ value: v }) => v && v.swatchId).filter(isNonNullable)))]
  const skip = swatchIds.length === 0
  const { error, data = {} } = useQuery(SWATCHES_BY_ID, { skip, variables: { ids: swatchIds } })

  if (color == null || error != null) return null

  const { swatches = [] } = data

  return color
    .map(({ value: v, ...rest }) => {
      const { swatchId, alpha } = v
      const swatch = swatches.find((s: any) => s && s.id === swatchId)

      return swatch == null ? null : { ...rest, value: { swatch, alpha } }
    })
    .filter(isNonNullable)
}
