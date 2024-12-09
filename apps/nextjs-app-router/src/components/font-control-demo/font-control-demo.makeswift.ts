import { runtime } from '@/makeswift/runtime'
import { lazy } from 'react'

import { Style, Font, TextInput } from '@makeswift/runtime/controls'

runtime.registerComponent(
  lazy(() => import('./font-control-demo')),
  {
    type: 'Font Control Demo',
    label: 'Custom / Font Control Demo',
    props: {
      className: Style(),
      font: Font(),
      text: TextInput(),
    },
  },
)
