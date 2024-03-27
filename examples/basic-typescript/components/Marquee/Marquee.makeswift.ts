import dynamic from 'next/dynamic'

import { Checkbox, Image, List, Number, Shape, Style, TextInput } from '@makeswift/runtime/controls'
import { forwardNextDynamicRef } from '@makeswift/runtime/next'

import { runtime } from '@/lib/makeswift/runtime'

runtime.registerComponent(
  forwardNextDynamicRef(patch =>
    dynamic(() => patch(import('./Marquee').then(({ Marquee }) => Marquee)))
  ),
  {
    type: 'Marquee',
    label: 'Custom / Marquee',
    props: {
      className: Style(),
      logos: List({
        label: 'Logos',
        type: Shape({
          type: {
            logoImage: Image({
              label: 'Logo',
              format: Image.Format.WithDimensions,
            }),
            logoAlt: TextInput({
              label: 'Logo alt text',
              defaultValue: 'Image',
            }),
            logoWidth: Number({
              label: 'Width',
              defaultValue: 120,
              suffix: 'px',
            }),
          },
        }),
        getItemLabel(logo) {
          return logo?.logoAlt || 'Image'
        },
      }),
      duration: Number({
        label: 'Animation duration',
        defaultValue: 20,
        suffix: 's',
      }),
      fadeEdges: Checkbox({ label: 'Fade edges', defaultValue: true }),
    },
  }
)
