import Color from 'color'

import { type DataType, type ResolvedValueType } from '@makeswift/controls'

import { ColorDefinition } from '../../../controls'

import { useSwatch } from '../hooks/makeswift-api'

export function useColorValue(
  data: DataType<ColorDefinition> | undefined,
  definition: ColorDefinition,
): ResolvedValueType<ColorDefinition> {
  const swatchId = data?.swatchId ?? null
  const swatch = useSwatch(swatchId)
  const alpha = data?.alpha ?? 1

  if (swatch == null) {
    const { defaultValue } = definition.config

    if (defaultValue === undefined) return undefined

    let defaultColor
    try {
      defaultColor = Color(definition.config.defaultValue)
    } catch {
      defaultColor = Color()
    }

    return defaultColor.rgb().string()
  }

  return Color({ h: swatch.hue, s: swatch.saturation, l: swatch.lightness })
    .alpha(alpha)
    .rgb()
    .string()
}
