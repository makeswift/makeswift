'use client'

import { forwardRef, Ref } from 'react'

import { VideoData } from '@makeswift/prop-controllers'

type Props = {
  id?: string
  video?: VideoData
  width?: string
  margin?: string
  borderRadius?: string
}

const Video = forwardRef(function Video(_: Props, _ref: Ref<HTMLDivElement>) {
  return <p>Video not implemented</p>
})

export default Video
