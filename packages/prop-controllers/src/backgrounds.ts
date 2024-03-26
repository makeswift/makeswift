import { ImageValueV0, ImageValueV1 } from './image'
import {
  Color,
  ControlDataTypeKey,
  Options,
  ResponsiveValue,
  Types,
} from './prop-controllers'
import { match } from 'ts-pattern'

type ColorBackground = { type: 'color'; id: string; payload: Color | null }

type GradientStop = { id: string; location: number; color: Color | null }

type Gradient = { angle?: number; isRadial?: boolean; stops: GradientStop[] }

type GradientBackground = { type: 'gradient'; id: string; payload: Gradient }

type BackgroundImagePosition = { x: number; y: number }

type BackgroundImageSize = 'cover' | 'contain' | 'auto'

type BackgroundImageRepeat = 'no-repeat' | 'repeat-x' | 'repeat-y' | 'repeat'

type BackgroundImageV0 = {
  imageId: ImageValueV0
  position: BackgroundImagePosition
  size?: BackgroundImageSize
  repeat?: BackgroundImageRepeat
  opacity?: number
  parallax?: number
  priority?: boolean
}

type BackgroundImageV1 = {
  version: 1
  image: ImageValueV1
  position: BackgroundImagePosition
  size?: BackgroundImageSize
  repeat?: BackgroundImageRepeat
  opacity?: number
  parallax?: number
  priority?: boolean
}

export type BackgroundImage = BackgroundImageV0 | BackgroundImageV1

type ImageBackgroundV0 = {
  type: 'image'
  id: string
  payload: BackgroundImageV0
}

type ImageBackgroundV1 = {
  type: 'image-v1'
  id: string
  payload: BackgroundImageV1
}

export type ImageBackground = ImageBackgroundV0 | ImageBackgroundV1

type BackgroundVideoAspectRatio = 'wide' | 'standard'

type BackgroundVideo = {
  url?: string
  maskColor?: Color | null
  opacity?: number
  zoom?: number
  aspectRatio?: BackgroundVideoAspectRatio
  parallax?: number
}

type VideoBackground = { type: 'video'; id: string; payload: BackgroundVideo }

type Background =
  | ColorBackground
  | GradientBackground
  | ImageBackground
  | VideoBackground

const BackgroundPropDataTypeKey = ControlDataTypeKey

const BackgroundPropDataTypeValueV1 = 'prop-controller::backgrounds::v1'

type ResponsiveBackgrounds = ResponsiveValue<Background[]>

type BackgroundV0 = ResponsiveBackgrounds

type BackgroundV1 = {
  [BackgroundPropDataTypeKey]: typeof BackgroundPropDataTypeValueV1
  value: ResponsiveBackgrounds
}

export type BackgroundsPropControllerData = BackgroundV0 | BackgroundV1

export function getResponsiveBackgrounds(
  backgroundPropControllerData:
    | BackgroundsPropControllerData
    | null
    | undefined,
): ResponsiveBackgrounds | null | undefined {
  return match(backgroundPropControllerData)
    .with(
      { [BackgroundPropDataTypeKey]: BackgroundPropDataTypeValueV1 },
      (val) => val.value,
    )
    .otherwise((val) => val)
}

type BackgroundsOptions = Options<Record<string, never>>

export type BackgroundsDescriptor<_T = BackgroundsPropControllerData> = {
  type: typeof Types.Backgrounds
  version?: 1
  options: BackgroundsOptions
}

export function Backgrounds(
  options: BackgroundsOptions = {},
): BackgroundsDescriptor {
  return { type: Types.Backgrounds, version: 1, options }
}
