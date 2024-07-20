import { type ResponsiveValue } from '@makeswift/controls'

export type SwatchValue = {
  hue: number
  saturation: number
  lightness: number
}

export type ColorValue = { swatch?: SwatchValue; alpha?: number }

export type ResponsiveColor = ResponsiveValue<ColorValue>
