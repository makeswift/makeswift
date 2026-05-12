import { runtime } from '@/makeswift/runtime'
import { lazy } from 'react'

import { Style, RichText, Select } from '@makeswift/runtime/controls'

runtime.registerComponent(
  lazy(() => import('./client')),
  {
    type: 'RichText Demo',
    label: 'Custom / RichText Demo',
    props: {
      className: Style(),
      layout: Select({
        label: 'Layout',
        options: [
          { label: 'Rows', value: 'rows' },
          { label: 'Columns', value: 'columns' },
        ],
        defaultValue: 'columns',
      }),
      leftText: RichText(),
      rightText: RichText(),
    },
  },
)
