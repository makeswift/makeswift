import styled, { css } from 'styled-components'
import NextImage from 'next/image'

import { cssMediaRules } from '../../../../utils/cssMediaRules'
import { BackgroundsPropControllerData } from '../../../../hooks'
import { ResponsiveValue } from '../../../../../prop-controllers'
import { ColorValue as Color } from '../../../../utils/types'
import { colorToString } from '../../../../utils/colorToString'
import Parallax from '../Parallax'
import BackgroundVideo from '../BackgroundVideo'
import { useIsPrefetching } from '../../../../../api/react'

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

type AspectRatio = 'wide' | 'standard'

const getAspectRatio = (aspectRatio: AspectRatio) => {
  switch (aspectRatio) {
    case 'wide':
      return 16 / 9
    case 'standard':
      return 4 / 3
    default:
      return 16 / 9
  }
}

const AbsoluteFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const Container = styled(AbsoluteFill)`
  border-radius: inherit;
`

const BackgroundsContainer = styled(Container)<{ visibility: ResponsiveValue<boolean> }>`
  overflow: hidden;
  ${p =>
    cssMediaRules(
      [p.visibility],
      ([visibility]) => css`
        display: ${visibility === true ? 'block' : 'none'};
      `,
    )}
`

type Props = { backgrounds: BackgroundsPropControllerData | null | undefined }

export default function Backgrounds({ backgrounds }: Props): JSX.Element {
  const isPrefetching = useIsPrefetching()

  if (isPrefetching) return <></>

  if (backgrounds == null) return <></>

  return (
    <>
      {backgrounds.map(({ value, deviceId }) => {
        const visibility = backgrounds.map(v => ({
          deviceId: v.deviceId,
          value: v.deviceId === deviceId,
        }))

        return (
          <BackgroundsContainer key={deviceId} visibility={visibility}>
            {[...value].reverse().map(bg => {
              if (bg.type === 'color') {
                return (
                  <Container
                    key={bg.id}
                    style={{
                      backgroundColor: getColor(bg.payload),
                    }}
                  />
                )
              }

              if (bg.type === 'image' && bg.payload) {
                const {
                  publicUrl,
                  position,
                  repeat = 'no-repeat',
                  size = 'cover',
                  opacity,
                  parallax,
                } = bg.payload
                const backgroundPosition = `${position.x}% ${position.y}%`

                if (repeat === 'no-repeat' && size !== 'auto' && publicUrl != null) {
                  return (
                    <Parallax key={bg.id} strength={parallax}>
                      {getParallaxProps => (
                        <div {...getParallaxProps({ style: { opacity, overflow: 'hidden' } })}>
                          <NextImage
                            src={publicUrl}
                            layout="fill"
                            objectPosition={backgroundPosition}
                            objectFit={size}
                          />
                        </div>
                      )}
                    </Parallax>
                  )
                }

                return (
                  <Parallax key={bg.id} strength={parallax}>
                    {getParallaxProps => (
                      <Container
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

              if (bg.type === 'gradient' && bg.payload) {
                const { angle, stops, isRadial } = bg.payload
                const gradient = `${getStopsStyle(stops)}`

                return (
                  <Container
                    key={bg.id}
                    style={{
                      background: isRadial
                        ? `radial-gradient(${gradient})`
                        : `linear-gradient(${angle}rad, ${gradient})`,
                    }}
                  />
                )
              }

              if (bg.type === 'video' && bg.payload) {
                const { url, aspectRatio, maskColor, zoom, opacity, parallax } = bg.payload

                return (
                  <Parallax key={bg.id} strength={parallax}>
                    {getParallaxProps => (
                      <Container {...getParallaxProps({})}>
                        <BackgroundVideo
                          url={url}
                          zoom={zoom}
                          opacity={opacity}
                          aspectRatio={getAspectRatio(aspectRatio)}
                          maskColor={getColor(maskColor)}
                        />
                      </Container>
                    )}
                  </Parallax>
                )
              }

              return null
            })}
          </BackgroundsContainer>
        )
      })}
    </>
  )
}
