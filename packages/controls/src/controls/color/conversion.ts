import parseColor from 'color'

import { type Swatch } from '../../resources'

export function swatchToColorString(
  swatch: Swatch | null,
  alpha: number,
  defaultValue?: string,
): string | undefined {
  if (swatch == null) {
    return defaultValue === undefined
      ? undefined
      : safeParseColor(defaultValue).rgb().string()
  }

  return parseColor({
    h: swatch.hue,
    s: swatch.saturation,
    l: swatch.lightness,
  })
    .alpha(alpha)
    .rgb()
    .string()
}

function safeParseColor(value: string) {
  try {
    return parseColor(value)
  } catch {
    return parseColor()
  }
}
