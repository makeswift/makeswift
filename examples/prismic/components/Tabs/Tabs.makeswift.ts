import { lazy } from 'react'

import { List, Shape, Slot, Style, TextInput } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

runtime.registerComponent(
  lazy(() => import('./Tabs')),
  {
    type: 'Tabs',
    label: 'Custom / Tabs',
    props: {
      className: Style(),
      tabs: List({
        label: 'Tabs',
        type: Shape({
          type: {
            children: Slot(),
            title: TextInput({ label: 'Title', defaultValue: 'Tab' }),
          },
        }),
        getItemLabel(item) {
          return item?.title ?? 'Tab'
        },
      }),
      ariaLabel: TextInput({ label: 'ARIA Label' }),
    },
  }
)
