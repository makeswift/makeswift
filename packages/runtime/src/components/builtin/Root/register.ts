import { Backgrounds, GapX, GapY, Grid } from '@makeswift/prop-controllers'
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
        children: Grid(),
        backgrounds: Backgrounds(),
        rowGap: GapY(),
        columnGap: GapX(),
      },
    },
  )
}
