import dynamic from 'next/dynamic'

import { forwardNextDynamicRef } from '../../../next'
import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../react'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    forwardNextDynamicRef(patch => dynamic(() => patch(import('./Root')))),
    {
      type: './components/Root/index.js',
      label: 'Page',
      hidden: true,
      props: {
        children: Props.Grid(),
        backgrounds: Props.Backgrounds(),
        rowGap: Props.GapY(),
        columnGap: Props.GapX(),
      },
    },
  )
}
