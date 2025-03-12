import { lazy } from 'react'

import { Group, List, Select, Slot, Style, TextInput } from '@makeswift/runtime/controls'

import { runtime } from '@/makeswift/runtime'

runtime.registerComponent(
  lazy(() => import('./Accordions')),
  {
    type: 'accordions',
    label: 'Custom / Accordions',
    props: {
      className: Style(),
      accordions: List({
        label: 'Accordions',
        type: Group({
          props: {
            title: Slot(),
            subtitle: TextInput(),
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
