export type SwatchValue = {
  hue: number
  saturation: number
  lightness: number
}

export type ColorValue = { swatch?: SwatchValue; alpha: number }
