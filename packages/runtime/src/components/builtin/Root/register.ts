import dynamic from 'next/dynamic'

import { forwardNextDynamicRef } from '../../../next/dynamic'
import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../react'
import { MakeswiftComponentType } from '../constants'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    forwardNextDynamicRef(patch => dynamic(() => patch(import('./Root')))),
    {
      type: MakeswiftComponentType.Root,
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
