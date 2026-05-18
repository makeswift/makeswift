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
            icon: IconRadioGroup.Icon.TextAlignLeft,
            label: 'Left',
            value: 'left',
          },
          {
            icon: IconRadioGroup.Icon.TextAlignCenter,
            label: 'Center',
            value: 'center',
          },
          {
            icon: IconRadioGroup.Icon.TextAlignRight,
            label: 'Right',
            value: 'right',
          },
          {
            icon: IconRadioGroup.Icon.TextAlignJustify,
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
            icon: IconRadioGroup.Icon.Superscript,
            label: 'Superscript',
            value: 'superscript',
          },
          {
            icon: IconRadioGroup.Icon.Subscript,
            label: 'Subscript',
            value: 'subscript',
          },
          {
            icon: IconRadioGroup.Icon.Code,
            label: 'Code',
            value: 'code',
          },
        ],
      }),
    },
  },
)
