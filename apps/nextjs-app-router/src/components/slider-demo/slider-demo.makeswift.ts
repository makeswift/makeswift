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

      // Single value sliders
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

      // Range sliders (two handles)
      priceRange: Slider({
        label: 'Price Range',
        defaultValue: { start: 100, end: 800 },
        min: 0,
        max: 1000,
        step: 10,
        range: true,
      }),

      temperatureRange: Slider({
        label: 'Temperature Range',
        defaultValue: { start: 10, end: 25 },
        min: -20,
        max: 40,
        step: 1,
        range: true,
      }),
    },
  },
)
