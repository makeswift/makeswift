export type ImageControlData = string

export const ImageControlType = 'makeswift::controls::image'

export const ImageControlValueFormat = {
  URL: 'makeswift::controls::image::format::url',
  WithDimensions: 'makeswift::controls::image::format::with-dimensions',
} as const

type ImageControlValueFormat = typeof ImageControlValueFormat[keyof typeof ImageControlValueFormat]

type ImageControlConfig = { label?: string; format?: ImageControlValueFormat }

export type ImageControlDefinition<T extends ImageControlConfig = ImageControlConfig> = {
  type: typeof ImageControlType
  config: T
}

export function Image<T extends ImageControlConfig>(
  config: T = {} as T,
): ImageControlDefinition<T> {
  return { type: ImageControlType, config }
}

Image.Format = ImageControlValueFormat
