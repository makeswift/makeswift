import parseColor from 'color'
import { Color, type ControlDefinitionType, type ControlDataType } from '@makeswift/controls'
import { useSwatch } from '../hooks/makeswift-api'

// export type ColorControlValue<T extends ColorControlDefinition> =
//   undefined extends T['config']['defaultValue'] ? string | undefined : string

export function useColorValue(
  data: ControlDataType<typeof Color> | undefined,
  definition: ControlDefinitionType<typeof Color>,
): string | undefined {
  const swatchId = data?.swatchId ?? null
  const swatch = useSwatch(swatchId)
  console.log('+++++++ useColorValue', { swatchId, swatch, data, definition })
  const alpha = data?.alpha ?? 1

  if (swatch == null) {
    const { defaultValue } = definition.config

    if (defaultValue === undefined) return undefined

    let defaultColor
    try {
      defaultColor = parseColor(definition.config.defaultValue)
    } catch {
      defaultColor = parseColor()
    }

    return defaultColor.rgb().string()
  }

  return parseColor({ h: swatch.hue, s: swatch.saturation, l: swatch.lightness })
    .alpha(alpha)
    .rgb()
    .string()
}
