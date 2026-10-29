import {
  ContextResource,
  replaceResourceIfNeeded,
  shouldRemoveResource,
  type CopyContext,
} from '../context'

import {
  type ColorData,
  type ColorDataV2,
  type InlineColorData,
  type ResolvedInlineColorData,
  type SwatchColorData,
} from './types'

export function toColorDataV2({ swatchId, alpha }: ColorData): SwatchColorData {
  return { type: 'swatch', swatchId, alpha }
}

/**
 * Throws for inline colors, which data written by earlier versions can't
 * represent.
 */
export function toColorDataV1(color: ColorDataV2): ColorData {
  if (color.type === 'inline') {
    throw new Error(
      `Inline colors can't be written as swatch color data: ${JSON.stringify(color)}`,
    )
  }

  return { swatchId: color.swatchId, alpha: color.alpha }
}

function copySwatchColor<T extends { swatchId: string }>(
  color: T,
  context: CopyContext,
): T | undefined {
  if (shouldRemoveResource(ContextResource.Swatch, color.swatchId, context)) {
    return undefined
  }

  return {
    ...color,
    swatchId: replaceResourceIfNeeded(
      ContextResource.Swatch,
      color.swatchId,
      context,
    ),
  }
}

/**
 * Returns `undefined` when the color's swatch is marked for removal.
 */
export function copyColorDataV1(
  color: ColorData,
  context: CopyContext,
): ColorData | undefined {
  return copySwatchColor(color, context)
}

/**
 * Returns `undefined` when the color's swatch is marked for removal.
 */
export function copyColorDataV2(
  color: ColorDataV2,
  context: CopyContext,
): ColorDataV2 | undefined {
  if (color.type === 'inline') return color

  return copySwatchColor(color, context)
}

export function resolveInlineColorData({
  type: _,
  alpha,
  ...swatch
}: InlineColorData): ResolvedInlineColorData {
  return { swatch, alpha }
}
