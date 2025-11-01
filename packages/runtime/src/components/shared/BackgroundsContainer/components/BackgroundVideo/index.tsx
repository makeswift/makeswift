import { cx } from '@emotion/css'
import { useState, useRef, ComponentPropsWithoutRef, ForwardedRef, forwardRef, ReactNode } from 'react'

import { ReactPlayer } from '../../../react-player'
import { useStyle } from '../../../../../runtimes/react/use-style'

import { useIsomorphicLayoutEffect } from '../../../../hooks/useIsomorphicLayoutEffect'

const Container = forwardRef(function Container(
  { className, ...restOfProps }: ComponentPropsWithoutRef<'div'>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...restOfProps}
      ref={ref}
      className={cx(
        useStyle({
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }),
        className,
      )}
    />
  )
})

function Mask({
  backgroundColor,
  visible,
}: {
  backgroundColor: string | undefined
  visible: boolean
}) {
  return (
    <div
      className={useStyle({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: backgroundColor,
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s',
      })}
    />
  )
}

const getScale = (element: HTMLElement, aspectRatio: number, zoom: number) => {
  const { offsetWidth: width, offsetHeight: height } = element
  const computedAspectRatio = width / height

  return Math.max(aspectRatio / computedAspectRatio, computedAspectRatio / aspectRatio) * zoom
}

type Props = {
  url?: string
  aspectRatio?: number
  zoom?: number
  opacity?: number
  maskColor?: string
}

export default function BackgroundVideo({
  url = '',
  aspectRatio = 16 / 9,
  zoom = 1,
  maskColor,
  opacity,
}: Props): ReactNode {
  const [ready, setReady] = useState(false)
  const [scale, setScale] = useState(1)
  const container = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const { current: containerEl } = container

    if (!containerEl) return undefined

    const { defaultView } = containerEl.ownerDocument
    const handleResize = () => setScale(getScale(containerEl, aspectRatio, zoom))

    handleResize()

    defaultView!.addEventListener('resize', handleResize)

    return () => defaultView!.removeEventListener('resize', handleResize)
  }, [aspectRatio, zoom])

  if (!ReactPlayer.canPlay(url)) return <></>

  return (
    <Container ref={container}>
      {container.current && (
        <ReactPlayer
          url={url}
          config={{
            vimeo: { playerOptions: { background: true } },
            youtube: {
              playerVars: {
                origin: container.current.ownerDocument.defaultView?.location.origin,
              },
            },
            wistia: {
              options: {
                endVideoBehavior: 'loop',
                playbackRateControl: false,
                playbar: false,
                playButton: false,
                volumeControl: false,
                fullscreenButton: false,
                muted: true,
              },
            },
          }}
          playing
          loop
          muted
          playsinline={true}
          controls={false}
          onReady={() => setReady(true)}
          style={{
            transform: `scale3d(${scale}, ${scale}, 1)`,
            opacity,
          }}
          width="100%"
          height="100%"
        />
      )}
      <Mask backgroundColor={maskColor} visible={!ready} />
    </Container>
  )
}
