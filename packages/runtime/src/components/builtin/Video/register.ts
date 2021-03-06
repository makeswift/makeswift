import dynamic from 'next/dynamic'

import { forwardNextDynamicRef } from '../../../next'
import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    forwardNextDynamicRef(patch => dynamic(() => patch(import('./Video')))),
    {
      type: './components/Video/index.js',
      label: 'Video',
      icon: 'Video40',
      props: {
        id: Props.ElementID(),
        video: Props.Video({ preset: { controls: true } }),
        width: Props.Width({
          format: Props.Width.Formats.ClassName,
          defaultValue: { value: 560, unit: 'px' },
        }),
        margin: Props.Margin(),
        borderRadius: Props.BorderRadius(),
      },
    },
  )
}
