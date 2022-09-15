import dynamic from 'next/dynamic'

import { forwardNextDynamicRef } from '../../../next'
import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'
import { MakeswiftComponentType } from '../constants'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    forwardNextDynamicRef(patch => dynamic(() => patch(import('./Embed')))),
    {
      type: MakeswiftComponentType.Embed,
      label: 'Embed',
      icon: 'Code40',
      props: {
        id: Props.ElementID(),
        html: Props.TextArea({ label: 'Code', rows: 20 }),
        width: Props.Width({}),
        margin: Props.Margin(),
      },
    },
  )
}
