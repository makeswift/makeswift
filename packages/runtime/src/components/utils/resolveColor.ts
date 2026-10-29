import { resolveInlineColorData, type NullableColorDataV2 } from '@makeswift/controls'

import { type Swatch } from '../../api'
import { isNonNullable } from './isNonNullable'
import type { ColorValue } from './types'

/**
 * Resolves color data to a renderable color. A swatch color resolves to
 * `{ swatch: undefined }` when its swatch hasn't been fetched or doesn't exist.
 */
export function resolveColor(color: NullableColorDataV2, swatches: (Swatch | null)[]): ColorValue {
  if (color.type === 'inline') return resolveInlineColorData(color)

  const swatch = swatches.filter(isNonNullable).find(s => s.id === color.swatchId)
  return { swatch, alpha: color.alpha }
}
