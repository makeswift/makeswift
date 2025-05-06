import { getReplacementSwatchId, shouldRemoveSwatch } from '@makeswift/controls'
import { ColorData } from '../data'
import { CopyContext } from '../prop-controllers'

export function copyColorData(
  data: ColorData | null,
  context: CopyContext,
): ColorData | null {
  if (data == null) return data
  if (shouldRemoveSwatch(data.swatchId, context)) return null
  return {
    ...data,
    swatchId: getReplacementSwatchId(data.swatchId, context) ?? data.swatchId,
  }
}
