import { ColorData } from '../data'
import { CopyContext } from '../prop-controllers'

export function copyColorData(
  data: ColorData | null,
  context: CopyContext,
): ColorData | null {
  if (data == null) return data
  if (context.clearContext.swatchIds.has(data.swatchId)) {
    return null
  }
  return {
    ...data,
    swatchId:
      context.replacementContext.swatchIds.get(data.swatchId) ?? data.swatchId,
  }
}
