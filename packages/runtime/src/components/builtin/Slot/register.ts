import { ReactRuntime } from '../../../react'
import { MakeswiftComponentType } from '../constants'
import { Checkbox } from '@makeswift/controls'
import { Slot } from '../../../controls'
import SlotComponent from './Slot'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(SlotComponent, {
    type: MakeswiftComponentType.Slot,
    label: 'Slot',
    hidden: true,
    props: {
      children: Slot(),
      showFallback: Checkbox({ label: 'Use fallback', defaultValue: true }),
    },
  })
}
