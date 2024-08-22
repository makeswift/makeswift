import { unstable_IconRadioGroup, deserializeRecord } from '@makeswift/controls'

import { unstable_StyleV2, StyleV2Definition } from './style-v2'
import { deserializeUnifiedControlDef } from '../../builder'

describe('StyleV2', () => {
  test('serialization', () => {
    const definition = unstable_StyleV2({
      type: unstable_IconRadioGroup({
        label: 'Alignment',
        options: [
          {
            icon: unstable_IconRadioGroup.Icon.TextAlignLeft,
            label: 'Left Align',
            value: 'left',
          },
          {
            icon: unstable_IconRadioGroup.Icon.TextAlignCenter,
            label: 'Center Align',
            value: 'center',
          },
          {
            icon: unstable_IconRadioGroup.Icon.TextAlignRight,
            label: 'Right Align',
            value: 'right',
          },
          {
            icon: unstable_IconRadioGroup.Icon.TextAlignJustify,
            label: 'Justify',
            value: 'justify',
          },
        ],
        defaultValue: 'left',
      }),
      getStyle(textAlign) {
        return { textAlign }
      },
    })

    const [serialized, transferables] = definition.serialize()
    transferables.forEach((port: any) => port.close())

    const deserialized = StyleV2Definition.deserialize(
      deserializeRecord(serialized),
      deserializeUnifiedControlDef,
    )

    expect(deserialized).toMatchSnapshot()
  })
})
