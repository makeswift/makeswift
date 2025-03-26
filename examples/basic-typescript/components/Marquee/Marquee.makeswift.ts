import dynamic from 'next/dynamic'

import { Checkbox, Group, Image, List, Number, Style, TextInput } from '@makeswift/runtime/controls'
import { runtime } from 'lib/makeswift/runtime'

runtime.registerComponent(
  dynamic(() => import('./Marquee')),
  {
    type: 'Marquee',
    label: 'Custom / Marquee',
    props: {
      className: Style(),
      logos: List({
        label: 'Logos',
        type: Group({
          props: {
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
