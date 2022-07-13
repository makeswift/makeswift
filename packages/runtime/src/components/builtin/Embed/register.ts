import dynamic from 'next/dynamic'

import { forwardNextDynamicRef } from '../../../next'
import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    forwardNextDynamicRef(patch => dynamic(() => patch(import('./Embed')))),
    {
      type: './components/Embed/index.js',
      label: 'Embed',
      icon: 'Code40',
      props: {
        id: Props.ElementID(),
        html: Props.TextArea({ label: 'Code', rows: 20 }),
        width: Props.Width({ format: Props.Width.Formats.ClassName }),
        margin: Props.Margin(),
      },
    },
  )
}
