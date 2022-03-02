import type { ColorValue as Color } from './types'

export function colorToString(color?: Color): string {
  return color && color.swatch
    ? `hsla(${color.swatch.hue},${color.swatch.saturation}%,${color.swatch.lightness}%,${color.alpha})`
    : ''
}
