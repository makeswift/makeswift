import { runtime } from '@/makeswift/runtime'
import { lazy } from 'react'

import { Style, Date } from '@makeswift/runtime/controls'

runtime.registerComponent(
  lazy(() => import('./date-demo')),
  {
    type: 'Date Control Demo',
    label: 'Custom / Date Control Demo',
    props: {
      className: Style(),

      eventDate: Date({
        label: 'Event date',
        defaultValue: '2024-01-01T00:00:00.000Z',
      }),

      startsAt: Date({
        label: 'Starts at',
        includeTime: true,
        defaultValue: '2024-06-15T12:30:00.000Z',
      }),
    },
  },
)
