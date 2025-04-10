import { lazy } from 'react'

import {
  Style,
  TextInput,
  Group,
  Checkbox,
  Color,
} from '@makeswift/runtime/controls'
import { ReactRuntime } from '@makeswift/runtime/react'

export const MakeswiftGroupDemo = ReactRuntime.connect(
  lazy(() => import('./group-demo')),
  {
    type: 'Group Control Demo',
    label: 'Custom / Group Control Demo',
    props: {
      className: Style(),

      group: Group({
        props: {
          color: Color(),
          checkbox: Checkbox(),
          text: TextInput(),
        },
      }),

      groupPopover: Group({
        label: 'Group Popover',
        preferredLayout: Group.Layout.Popover,
        props: {
          color: Color(),
          checkbox: Checkbox(),
          text: TextInput(),
        },
      }),
    },
  },
)
