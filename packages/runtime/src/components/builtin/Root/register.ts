import { GapX } from '@makeswift/prop-controllers'
import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../react'
import { MakeswiftComponentType } from '../constants'
import { lazy } from 'react'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    lazy(() => import('./Root')),
    {
      type: MakeswiftComponentType.Root,
      label: 'Page',
      hidden: true,
      props: {
        children: Props.Grid(),
        backgrounds: Props.Backgrounds(),
        rowGap: Props.GapY(),
        columnGap: GapX(),
      },
    },
  )
}
