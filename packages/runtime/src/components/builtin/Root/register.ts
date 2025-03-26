import { Backgrounds, GapX, GapY, Grid } from '@makeswift/prop-controllers'
import { ReactRuntime } from '../../../react'
import { MakeswiftComponentType } from '../constants'
import dynamic from 'next/dynamic'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    dynamic(() => import('./Root')),
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
