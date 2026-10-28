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

  return hslToColorString(swatch, alpha)
}

export function hslToColorString(
  {
    hue,
    saturation,
    lightness,
  }: { hue: number; saturation: number; lightness: number },
  alpha: number,
): string {
  return parseColor({ h: hue, s: saturation, l: lightness })
    .alpha(alpha)
    .rgb()
    .string()
}

export function safeColorString(color: string, opacity: number): string {
  return safeParseColor(color).alpha(opacity).rgb().string()
}

function safeParseColor(value: string) {
  try {
    return parseColor(value)
  } catch {
    return parseColor()
  }
}
