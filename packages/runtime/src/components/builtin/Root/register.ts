import { Backgrounds, GapX, GapY, Grid } from '@makeswift/prop-controllers'
import { ReactRuntime } from '../../../react'
import { MakeswiftComponentType } from '../constants'
import Root from './Root'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(Root, {
    type: MakeswiftComponentType.Root,
    label: 'Page',
    hidden: true,
    props: {
      children: Grid(),
      backgrounds: Backgrounds(),
      rowGap: GapY(),
      columnGap: GapX(),
    },
  })
}
