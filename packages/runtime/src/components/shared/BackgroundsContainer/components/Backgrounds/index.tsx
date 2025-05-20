// import NextImage from 'next/image'
// import type NextLegacyImageType from 'next/legacy/image'

import { BackgroundsPropControllerValue, BackgroundsData } from '../../../../hooks'
import { ResponsiveValue } from '../../../../../prop-controllers'
import { ColorValue as Color } from '../../../../utils/types'
import { colorToString } from '../../../../utils/colorToString'
import Parallax from '../Parallax'
import BackgroundVideo from '../BackgroundVideo'
import { CSSObject } from '@emotion/css'
import { useStyle } from '../../../../../runtimes/react/use-style'
import { useResponsiveStyle } from '../../../../utils/responsive-style'
// import { major as nextMajorVersion } from '../../../../../next/next-version'

// const NextLegacyImage = NextImage as typeof NextLegacyImageType

function getColor(color: Color | null | undefined) {
  if (color == null) return 'black'

  if (color.swatch == null) {
    return colorToString({ ...color, swatch: { hue: 0, saturation: 0, lightness: 0 } })
  }

  return colorToString(color)
}

type GradientStop = { color: Color | null | undefined; location: number }

const getStopsStyle = (stops: GradientStop[]) =>
  stops.map(({ color, location }) => `${getColor(color)} ${location}%`).join(',')

const absoluteFillStyle: CSSObject = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
}

const containerStyle: CSSObject = {
  ...absoluteFillStyle,
  borderRadius: 'inherit',
}

type Props = { backgrounds: BackgroundsPropControllerValue | null | undefined }

export default function Backgrounds({ backgrounds }: Props): JSX.Element {
  if (backgrounds == null) return <></>

  return (
    <>
      {backgrounds.map(({ value, deviceId }) => {
        const visibility = backgrounds.map(v => ({
          deviceId: v.deviceId,
          value: v.deviceId === deviceId,
        }))

        return <BackgroundDeviceLayer key={deviceId} layer={value} visibility={visibility} />
      })}
    </>
  )
}

type BackgroundLayerProps = {
  layer: BackgroundsData
  visibility: ResponsiveValue<boolean>
}

function BackgroundDeviceLayer({ layer, visibility }: BackgroundLayerProps) {
  const visibilityStyle = useResponsiveStyle([visibility], ([v]) => ({
    display: v === true ? 'block' : 'none',
  }))

  return (
    <div className={useStyle({ ...containerStyle, ...visibilityStyle, overflow: 'hidden' })}>
      {[...layer].reverse().map(bg => {
        if (bg.type === 'color') {
          return <ColorBackground key={bg.id} color={getColor(bg.payload)} />
        }

        if (bg.type === 'image' && bg.payload) {
          return <ImageBackground {...bg.payload} key={bg.id} />
        }

        if (bg.type === 'gradient' && bg.payload) {
          return (
            <GradientBackground
              {...bg.payload}
              key={bg.id}
              gradient={getStopsStyle(bg.payload.stops)}
            />
          )
        }

        if (bg.type === 'video' && bg.payload) {
          return (
            <VideoBackground
              {...bg.payload}
              key={bg.id}
              maskColor={getColor(bg.payload.maskColor)}
            />
          )
        }

        return null
      })}
    </div>
  )
}

type ColorBackgroundProps = { color: string }

function ColorBackground({ color }: ColorBackgroundProps) {
  return <div className={useStyle({ ...containerStyle, backgroundColor: color })} />
}

const ImageBackgroundRepeat = {
  NoRepeat: 'no-repeat',
  RepeatX: 'repeat-x',
  RepeatY: 'repeat-y',
  Repeat: 'repeat',
} as const

type ImageBackgroundRepeat = (typeof ImageBackgroundRepeat)[keyof typeof ImageBackgroundRepeat]

const ImageBackgroundSize = {
  Cover: 'cover',
  Contain: 'contain',
  Auto: 'auto',
} as const

type ImageBackgroundSize = (typeof ImageBackgroundSize)[keyof typeof ImageBackgroundSize]

type ImageBackgroundProps = {
  publicUrl?: string
  position: { x: number; y: number }
  repeat?: ImageBackgroundRepeat
  size?: ImageBackgroundSize
  opacity?: number
  parallax?: number
  priority?: boolean
}

function ImageBackground({
  publicUrl,
  position,
  repeat = ImageBackgroundRepeat.NoRepeat,
  size = ImageBackgroundSize.Cover,
  opacity,
  parallax,
  // priority,
}: ImageBackgroundProps) {
  const backgroundPosition = `${position.x}% ${position.y}%`
  const containerClassName = useStyle(containerStyle)

  if (repeat === 'no-repeat' && size !== 'auto' && publicUrl != null) {
    return (
      <Parallax strength={parallax}>
        {getParallaxProps => (
          <div {...getParallaxProps({ style: { opacity, overflow: 'hidden' } })}>
            <img src={publicUrl} />
            {/* DECOUPLE_TODO: */}
            {/* {nextMajorVersion < 13 ? (
              <NextLegacyImage
                src={publicUrl}
                layout="fill"
                objectPosition={backgroundPosition}
                objectFit={size}
                priority={priority}
              />
            ) : (
              <NextImage
                src={publicUrl}
                alt={''}
                fill
                sizes="100vw"
                style={{
                  objectPosition: backgroundPosition,
                  objectFit: size,
                }}
                priority={priority}
              />
            )} */}
          </div>
        )}
      </Parallax>
    )
  }

  return (
    <Parallax strength={parallax}>
      {getParallaxProps => (
        <div
          className={containerClassName}
          {...getParallaxProps({
            style: {
              backgroundImage: publicUrl != null ? `url('${publicUrl}')` : undefined,
              backgroundPosition,
              backgroundRepeat: repeat,
              backgroundSize: size,
              opacity,
            },
          })}
        />
      )}
    </Parallax>
  )
}

type GradientBackgroundProps = {
  gradient: string
  angle?: number
  isRadial?: boolean
}

function GradientBackground({
  gradient,
  isRadial = false,
  angle = Math.PI,
}: GradientBackgroundProps) {
  return (
    <div
      className={useStyle({
        ...containerStyle,
        background: isRadial
          ? `radial-gradient(${gradient})`
          : `linear-gradient(${angle}rad, ${gradient})`,
      })}
    />
  )
}

const BackgroundVideoAspectRatio = {
  Wide: 'wide',
  Standard: 'standard',
} as const

type BackgroundVideoAspectRatio =
  (typeof BackgroundVideoAspectRatio)[keyof typeof BackgroundVideoAspectRatio]

function getAspectRatio(aspectRatio: BackgroundVideoAspectRatio | null | undefined): number {
  switch (aspectRatio) {
    case 'wide':
      return 16 / 9

    case 'standard':
      return 4 / 3

    default:
      return 16 / 9
  }
}

type VideoBackgroundProps = {
  url?: string
  aspectRatio?: BackgroundVideoAspectRatio
  maskColor: string
  zoom?: number
  opacity?: number
  parallax?: number
}

function VideoBackground({
  url,
  aspectRatio,
  maskColor,
  zoom,
  opacity,
  parallax,
}: VideoBackgroundProps) {
  return (
    <Parallax strength={parallax}>
      {getParallaxProps => (
        <div {...getParallaxProps({ className: useStyle(containerStyle) })}>
          <BackgroundVideo
            url={url}
            zoom={zoom}
            opacity={opacity}
            aspectRatio={getAspectRatio(aspectRatio)}
            maskColor={maskColor}
          />
        </div>
      )}
    </Parallax>
  )
}
