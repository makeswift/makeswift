import { lazy } from 'react'

import { Style, Font, TextInput } from '@makeswift/runtime/controls'
import { ReactRuntime } from '@makeswift/runtime/react'

export const MakeswiftFontControlDemo = ReactRuntime.connect(
  lazy(() => import('./font-control-demo')),
  {
    type: 'Font Control Demo',
    label: 'Custom / Font Control Demo',
    props: {
      className: Style(),
      fontWithoutVariantWithoutDefault: Font({
        label: 'Font w/o variant w/o default',
        variant: false,
      }),
      fontWithVariantWithoutDefault: Font({
        label: 'Font w/ variant w/o default',
        variant: true,
      }),
      fontWithoutVariantWithDefault: Font({
        label: 'Font w/o variant w/ default',
        variant: false,
        defaultValue: {
          fontFamily: 'var(--font-grenze-gotisch)',
        },
      }),
      fontWithVariantWithDefault: Font({
        label: 'Font w/ variant w/ default',
        variant: true,
        defaultValue: {
          fontFamily: 'var(--font-grenze-gotisch)',
          fontStyle: 'normal',
          fontWeight: 700,
        },
      }),
      text: TextInput(),
    },
  },
)
