import { runtime } from '@/makeswift/runtime'
import { lazy } from 'react'

import {
  Style,
  TextInput,
  Shape,
  Checkbox,
  Color,
} from '@makeswift/runtime/controls'

runtime.registerComponent(
  lazy(() => import('./shape-v2-control-demo')),
  {
    type: 'ShapeV2 Control Demo',
    label: 'Custom /ShapeV2 Control Demo',
    props: {
      className: Style(),

      shapev2: Shape({
        type: {
          color: Color(),
          checkbox: Checkbox(),
          text: TextInput(),
        },
      }),
      shapev2popover: Shape({
        label: 'ShapeV2 in Popover',
        layout: Shape.Layout.Popover,
        type: {
          color: Color(),
          checkbox: Checkbox(),
          text: TextInput(),
        },
      }),
    },
  },
)
