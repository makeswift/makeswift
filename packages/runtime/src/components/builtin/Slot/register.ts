import dynamic from 'next/dynamic'
import { ReactRuntime } from '../../../react'
import { MakeswiftComponentType } from '../constants'
import { Checkbox } from '@makeswift/controls'
import { Slot } from '../../../controls'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    dynamic(() => import('./Slot')),
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
