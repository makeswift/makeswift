import { lazy } from 'react'

import { List, Select, Shape, Slot, Style } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

runtime.registerComponent(
  lazy(() => import('./Accordions')),
  {
    type: 'accordions',
    label: 'Custom / Accordions',
    props: {
      className: Style(),
      accordions: List({
        label: 'Accordions',
        type: Shape({
          type: {
            title: Slot(),
            body: Slot(),
          },
        }),
        getItemLabel() {
          return 'Slot'
        },
      }),
      type: Select({
        label: 'Type',
        options: [
          { label: 'Single', value: 'single' },
          { label: 'Multiple', value: 'multiple' },
        ],
        defaultValue: 'multiple',
      }),
    },
  }
)
