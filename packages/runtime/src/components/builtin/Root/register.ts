import { GapX, GapY } from '@makeswift/prop-controllers'
import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../react'
import { MakeswiftComponentType } from '../constants'
import { lazy } from 'react'
import { Slot } from '../../../controls'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    lazy(() => import('./Root')),
    {
      type: MakeswiftComponentType.Root,
      label: 'Page',
      hidden: true,
      props: {
        children: Slot(),
        backgrounds: Props.Backgrounds(),
        rowGap: GapY(),
        columnGap: GapX(),
      },
    },
  )
}
