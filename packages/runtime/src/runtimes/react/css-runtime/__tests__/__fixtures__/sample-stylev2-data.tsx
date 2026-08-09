import { Checkbox, ControlDefinition, DataType, StyleV2Definition } from '@makeswift/controls'
import { APIResource } from '../../../../../api/types'
import { unstable_StyleV2 } from '../../../../../controls'
import { CSSObject } from '@emotion/serialize'

export const styleV2Samples: Array<{
  description: string
  controlDefinition: StyleV2Definition<ControlDefinition, CSSObject>
  sampleData: DataType<StyleV2Definition<ControlDefinition, CSSObject>>
  resources: Array<APIResource>
}> = [
  {
    description: 'StyleV2 - nesting selector',
    controlDefinition: unstable_StyleV2({
      type: Checkbox({
        label: 'No-op',
        defaultValue: true,
      }),
      getStyle(_checkboxValue) {
        return {
          '&:hover': {
            background: 'purple',
          },
        }
      },
    }),
    sampleData: [
      {
        deviceId: 'desktop',
        value: {
          '@@makeswift/type': 'checkbox::v1',
          value: true,
        },
      },
    ],
    resources: [],
  },
]
