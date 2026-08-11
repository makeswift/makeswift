import { lazy } from 'react'
import { ReactRuntime } from '@makeswift/hono-react'
import { Combobox, Style, Slot } from '@makeswift/runtime/controls'

export const registerClockComponent = (runtime: ReactRuntime) =>
  runtime.registerComponent(
    lazy(() => import('./client').then((mod) => ({ default: mod.Clock }))),
    {
      type: 'clock',
      label: 'Custom / Clock',
      props: {
        className: Style(),
        hint: Slot(),
        format: Combobox({
          label: 'Format',
          getOptions: () =>
            [
              { id: 'time', value: 'time', label: 'Time' },
              { id: 'datetime', value: 'datetime', label: 'Datetime' },
            ] as const,
        }),
      },
    },
  )
