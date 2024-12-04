import { runtime } from '@/makeswift/runtime'
import { lazy } from 'react'

import { Style, Font, TextInput } from '@makeswift/runtime/controls'

runtime.registerComponent(
  lazy(() => import('./button')),
  {
    type: 'My Button',
    label: 'Custom / My Button',
    props: {
      className: Style(),
      font: Font(),
      text: TextInput(),
    },
  },
)
