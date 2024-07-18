export type Swatch = {
  id: string
  hue: number
  saturation: number
  lightness: number
}

export type File = {
  id: string
  name: string
  extension: string | null
  publicUrl: string
  dimensions: { width: number; height: number } | null
}
