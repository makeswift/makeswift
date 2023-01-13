import { cx } from '@emotion/css'
import { forwardRef, Ref, useEffect, useState } from 'react'
import ReactPlayer from 'react-player'

import { ElementIDValue, VideoValue } from '../../../prop-controllers/descriptors'
import { useStyle } from '../../../runtimes/react/use-style'
import { placeholders } from '../../utils/placeholders'

type Props = {
  id?: ElementIDValue
  video?: VideoValue
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

  return (
    <div
      ref={ref}
      id={id}
      className={cx(
        useStyle({ display: 'flex', flexDirection: 'column', overflow: 'hidden' }),
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
  )
})

export default Video
