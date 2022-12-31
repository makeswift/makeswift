import Color from 'color'
import { ColorControlData, ColorControlDefinition } from '../../../controls/color'
import { useSwatch } from '../hooks/makeswift-api'

export type ColorControlValue<T extends ColorControlDefinition> =
  undefined extends T['config']['defaultValue'] ? string | undefined : string

export function useColorValue<T extends ColorControlDefinition>(
  data: ColorControlData | undefined,
  definition: T,
): ColorControlValue<any> {
  const swatchId = data?.swatchId ?? null
  const swatch = useSwatch(swatchId)
  const alpha = data?.alpha ?? 1

  if (swatch == null) {
    const { defaultValue } = definition.config

    if (defaultValue === undefined) return undefined as ColorControlValue<T>

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
