import { runtime } from '@/makeswift/runtime'
import { lazy } from 'react'

import { Style, IconRadioGroup } from '@makeswift/runtime/controls'

runtime.registerComponent(
  lazy(() => import('./icon-radio-group-demo')),
  {
    type: 'IconRadioGroup Control Demo',
    label: 'Custom / IconRadioGroup Control Demo',
    props: {
      className: Style(),

      alignment: IconRadioGroup({
        label: 'Alignment',
        options: [
          {
            icon: 'text-align-left',
            label: 'Left',
            value: 'left',
          },
          {
            icon: 'text-align-center',
            label: 'Center',
            value: 'center',
          },
          {
            icon: 'text-align-right',
            label: 'Right',
            value: 'right',
          },
          {
            icon: 'text-align-justify',
            label: 'Justify',
            value: 'justify',
          },
        ],
        defaultValue: 'left',
      }),
      inlineStyle: IconRadioGroup({
        label: 'Inline Style',
        options: [
          {
            icon: 'superscript',
            label: 'Superscript',
            value: 'superscript',
          },
          {
            icon: 'subscript',
            label: 'Subscript',
            value: 'subscript',
          },
          {
            icon: 'code',
            label: 'Code',
            value: 'code',
          },
        ],
      }),
    },
  },
)
