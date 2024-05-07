type ImageControlDataV0 = string

type MakeswiftFileImageData = {
  type: 'makeswift-file'
  version: 1
  id: string
}

type ExternalFileImageData = {
  type: 'external-file'
  version: 1
  url: string
  width?: number | null
  height?: number | null
}

type ImageControlDataV1 = MakeswiftFileImageData | ExternalFileImageData

export type ImageControlData = ImageControlDataV0 | ImageControlDataV1

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
  version?: 1
}

export function Image<T extends ImageControlConfig>(
  config: T = {} as T,
): ImageControlDefinition<T> {
  return { type: ImageControlType, config, version: 1 }
}

Image.Format = ImageControlValueFormat
