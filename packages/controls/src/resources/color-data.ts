import { type ColorData, type ColorDataV2, type SwatchColorData } from './types'

export function toColorDataV2({ swatchId, alpha }: ColorData): SwatchColorData {
  return { type: 'swatch', swatchId, alpha }
}

/**
 * Throws for inline colors, which data written by earlier versions can't
 * represent.
 */
export function toLegacyColorData(color: ColorDataV2): ColorData {
  if (color.type === 'inline') {
    throw new Error(
      `Inline colors can't be written as swatch color data: ${JSON.stringify(color)}`,
    )
  }

  return { swatchId: color.swatchId, alpha: color.alpha }
}
