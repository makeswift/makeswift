import { IconRadioGroup, deserializeRecord } from '@makeswift/controls'

import { unstable_StyleV2, StyleV2Definition } from './style-v2'
import { deserializeUnifiedControlDef } from '../../builder'
import {
  ClientMessagePortSerializationVisitor,
  functionDeserializationPlugin,
} from '../visitors/message-port-serializer'

describe('StyleV2', () => {
  test('serialization', () => {
    const definition = unstable_StyleV2({
      type: IconRadioGroup({
        label: 'Alignment',
        options: [
          {
            icon: IconRadioGroup.Icon.TextAlignLeft,
            label: 'Left Align',
            value: 'left',
          },
          {
            icon: IconRadioGroup.Icon.TextAlignCenter,
            label: 'Center Align',
            value: 'center',
          },
          {
            icon: IconRadioGroup.Icon.TextAlignRight,
            label: 'Right Align',
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
      getStyle(textAlign) {
        return { textAlign }
      },
    })

    const serializationVisitor = new ClientMessagePortSerializationVisitor()
    const serialized = definition.accept(serializationVisitor)
    const transferables = serializationVisitor.getTransferables()
    transferables.forEach((port: any) => port.close())

    const deserialized = StyleV2Definition.deserialize(
      deserializeRecord(serialized, [functionDeserializationPlugin]),
      deserializeUnifiedControlDef,
    )

    expect(deserialized).toMatchSnapshot()
  })
})
