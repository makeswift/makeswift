'use client'

import { forwardRef, Ref, useEffect, useState } from 'react'

import { ReactPlayer } from '../../shared/react-player'
import { placeholders } from '../../utils/placeholders'
import { VideoData } from '@makeswift/prop-controllers'
import { useStyle } from '../../../runtimes/react/css-runtime/hooks/use-style'
import clsx from 'clsx'

type Props = {
  id?: string
  video?: VideoData
  width?: string
  margin?: string
  borderRadius?: string
}

const ASPECT_RATIO = 16 / 9

const Video = forwardRef(function Video(
  { id, video, width, margin, borderRadius }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const canPlayUrl = video && video.url != null && ReactPlayer.canPlay(video.url)
  /**
   * @see https://github.com/cookpete/react-player/issues/1428
   */
  const [shouldRenderReactPlayer, setShouldRenderReactPlayer] = useState(false)

  useEffect(() => {
    setShouldRenderReactPlayer(true)
  }, [])

  const { className: baseClassName, styleElement: baseStyleElement } = useStyle({ display: 'flex', flexDirection: 'column', overflow: 'hidden' })

  return (
    <>
      {baseStyleElement}
      <div
        ref={ref}
        id={id}
        className={clsx(
          baseClassName,
          width,
          margin,
          borderRadius,
        )}
      >
        <div style={{ position: 'relative', paddingTop: `${100 / ASPECT_RATIO}%` }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            {shouldRenderReactPlayer && canPlayUrl === true ? (
              <ReactPlayer
                {...video}
                width="100%"
                height="100%"
                config={{
                  vimeo: { playerOptions: { background: video != null && !video.controls } },
                  wistia: {
                    options: {
                      endVideoBehavior: video != null && video.loop === true ? 'loop' : 'default',
                    },
                  },
                }}
              />
            ) : (
              <img width="100%" src={placeholders.video.src} alt="Video Placeholder" />
            )}
          </div>
        </div>
      </div>
    </>
  )
})

export default Video
