import { Backgrounds, GapX, GapY, Grid } from '@makeswift/prop-controllers'
import { type ReactRuntimeCore } from '../../../runtimes/react/react-runtime-core'
import { MakeswiftComponentType } from '../constants'
import { lazy } from 'react'

export function registerComponent(runtime: ReactRuntimeCore) {
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
