import { forwardRef, Ref } from 'react'
import styled from 'styled-components'
import ReactPlayer from 'react-player'

import {
  BorderRadiusValue,
  ElementIDValue,
  MarginValue,
  VideoValue,
  WidthValue,
} from '../../../prop-controllers/descriptors'
import { cssBorderRadius, cssMargin, cssWidth } from '../../utils/cssMediaRules'
import { placeholders } from '../../utils/placeholders'

type Props = {
  id?: ElementIDValue
  video?: VideoValue
  width?: WidthValue
  margin?: MarginValue
  borderRadius?: BorderRadiusValue
}

const Container = styled.div.withConfig({
  shouldForwardProp: prop => !['width', 'margin', 'borderRadius'].includes(prop.toString()),
})<{ width: Props['width']; margin: Props['margin']; borderRadius: Props['borderRadius'] }>`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  ${cssWidth('560px')}
  ${cssMargin()}
  ${cssBorderRadius()}
`

const ASPECT_RATIO = 16 / 9

const Video = forwardRef(function Video(
  { id, video, width, margin, borderRadius }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const canPlayUrl = video && video.url != null && ReactPlayer.canPlay(video.url)

  return (
    <Container ref={ref} id={id} width={width} margin={margin} borderRadius={borderRadius}>
      <div style={{ position: 'relative', paddingTop: `${100 / ASPECT_RATIO}%` }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          {canPlayUrl === true ? (
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
    </Container>
  )
})

export default Video
