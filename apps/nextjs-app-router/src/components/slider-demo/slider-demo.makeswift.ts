import { runtime } from '@/makeswift/runtime'
import { lazy } from 'react'

import { Style, Slider } from '@makeswift/runtime/controls'

runtime.registerComponent(
  lazy(() => import('./slider-demo')),
  {
    type: 'Slider Control Demo',
    label: 'Custom / Slider Control Demo',
    props: {
      className: Style(),

      volume: Slider({
        label: 'Volume',
        defaultValue: 50,
        min: 0,
        max: 100,
        step: 1,
      }),

      opacity: Slider({
        label: 'Opacity',
        defaultValue: 1,
        min: 0,
        max: 1,
        step: 0.05,
      }),
    },
  },
)
