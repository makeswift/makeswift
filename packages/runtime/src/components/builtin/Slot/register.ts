import { lazy } from 'react'
import { type BasicReactRuntime } from '../../../react'
import { MakeswiftComponentType } from '../constants'
import { Checkbox } from '@makeswift/controls'
import { Slot } from '../../../controls'

export function registerComponent(runtime: BasicReactRuntime) {
  return runtime.registerComponent(
    lazy(() => import('./Slot')),
    {
      type: MakeswiftComponentType.Slot,
      label: 'Slot',
      hidden: true,
      props: {
        children: Slot(),
        showFallback: Checkbox({ label: 'Use fallback', defaultValue: true }),
      },
    },
  )
}
