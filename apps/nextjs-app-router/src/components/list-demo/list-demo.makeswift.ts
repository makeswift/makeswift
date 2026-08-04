import { runtime } from '@/makeswift/runtime'
import { lazy } from 'react'

import {
  Style,
  TextInput,
  Group,
  Checkbox,
  Color,
  List,
  Slot,
} from '@makeswift/runtime/controls'

runtime.registerComponent(
  lazy(() => import('./list-demo')),
  {
    type: 'List Control Demo',
    label: 'Custom / List Control Demo',
    props: {
      className: Style(),

      list: List({
        type: Group({
          props: {
            color: Color(),
            checkbox: Checkbox(),
            text: TextInput(),
            slot: Slot(),
            listOfSlots: List({
              type: Slot(),
            }),
          },
        }),
      }),
    },
  },
)
