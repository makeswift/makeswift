import { Link } from './link'
import { Options, Types } from './prop-controllers'

export type ImageValueV0 = string

type ImageValueV1MakeswiftFile = {
  version: 1
  type: 'makeswift-file'
  id: string
}

type ImageValueV1ExternalFile = {
  version: 1
  type: 'external-file'
  url: string
  width?: number | null
  height?: number | null
}

export type ImageValueV1 = ImageValueV1MakeswiftFile | ImageValueV1ExternalFile

export type ImageValue = ImageValueV0 | ImageValueV1

export type ImageOptions = Options<{ label?: string; hidden?: boolean }>

export type ImageDescriptor<_T = ImageValue> = {
  type: typeof Types.Image
  version?: 1
  options: ImageOptions
}

export function Image(options: ImageOptions = {}): ImageDescriptor {
  return { type: Types.Image, version: 1, options }
}

export type ImagesValueV0Item = {
  key: string
  props: {
    link?: Link
    file?: ImageValueV0
    altText?: string
  }
}

export type ImagesValueV1Item = {
  key: string
  version: 1
  props: {
    link?: Link
    file?: ImageValueV1
    altText?: string
  }
}

export type ImagesValueItem = ImagesValueV0Item | ImagesValueV1Item

export type ImagesValue = ImagesValueItem[]

type ImagesOptions = Options<{ preset?: ImagesValue }>

export type ImagesDescriptor<_T = ImagesValue> = {
  type: typeof Types.Images
  version?: 1
  options: ImagesOptions
}

export function Images(options: ImagesOptions = {}): ImagesDescriptor {
  return { type: Types.Images, version: 1, options }
}
