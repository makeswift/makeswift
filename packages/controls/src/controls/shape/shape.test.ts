import { Targets } from '../../introspection'
import { deserializeRecord, type DeserializedRecord } from '../../serialization'

import { Checkbox, CheckboxDefinition } from '../checkbox'
import { Color, ColorDefinition } from '../color'
import { Combobox } from '../combobox'
import { ControlDefinition } from '../definition'
import { Image } from '../image'
import { GenericLink as Link } from '../link'
import { TextArea } from '../text-area'
import { TextInput } from '../text-input'

import { Shape, ShapeDefinition } from './shape'

function deserializer(record: DeserializedRecord): ControlDefinition {
  switch (record.type) {
    case ShapeDefinition.type:
      return ShapeDefinition.deserialize(record, deserializer)

    case ColorDefinition.type:
      return ColorDefinition.deserialize(record)

    case CheckboxDefinition.type:
      return CheckboxDefinition.deserialize(record)

    default:
      throw new Error('Invalid control type')
  }
}

describe('Shape', () => {
  describe('constructor', () => {
    test('heterogenous controls', () => {
      const shape = Shape({
        type: {
          val: Color({ defaultValue: 'red' }),
          num: Checkbox(),
        },
      })
      expect(shape).toMatchSnapshot()
    })

    test('disallows extraneous properties', () => {
      Shape({
        type: {
          toggle: Checkbox(),
        },
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: ShapeDefinition) {}
    assignTest(
      Shape({
        type: {},
      }),
    )

    assignTest(
      Shape({
        type: {
          toggle: Checkbox(),
          color: Color({ defaultValue: 'red' }),
        },
      }),
    )

    assignTest(
      Shape({
        type: {
          combo: Combobox({
            getOptions: () => [{ id: '0', value: 'a', label: 'Alpha' }],
          }),
          link: Link({ label: 'Link' }),
        },
      }),
    )
  })

  describe('serialization', () => {
    test('serialize/deserialize shape of controls', () => {
      const shape = Shape({
        type: {
          color: Color({ defaultValue: 'red' }),
          checkbox: Checkbox(),
        },
      })

      const [serialized, _] = shape.serialize()
      expect(serialized).toMatchSnapshot()

      const deserialized = ShapeDefinition.deserialize(
        deserializeRecord(serialized),
        deserializer,
      )

      expect(deserialized).toEqual(shape)
    })

    test('serialize/deserialize composable shape of controls', () => {
      const shape = Shape({
        type: {
          shape: Shape({
            type: {
              color: Color({ defaultValue: 'red' }),
              checkbox: Checkbox(),
            },
          }),
        },
      })

      const [serialized, _] = shape.serialize()
      expect(serialized).toMatchSnapshot()

      const deserialized = ShapeDefinition.deserialize(
        deserializeRecord(serialized),
        deserializer,
      )

      expect(deserialized).toEqual(shape)
    })
  })

  describe('introspection', () => {
    test('is correctly delegated to subcontrols', () => {
      const shape = Shape({
        type: {
          color: Color({ defaultValue: 'red' }),
          link: Link(),
          image: Image(),
        },
      })

      const shapeData = {
        color: {
          swatchId: 'swatch-id',
          alpha: 1,
        },
        link: {
          type: 'OPEN_PAGE' as const,
          payload: {
            pageId: 'page-id',
            openInNewTab: false,
          },
        },
        image: 'file-id',
      }

      const swatchIds = shape.introspect(shapeData, Targets.Swatch)
      expect(swatchIds).toEqual(['swatch-id'])

      const pageIds = shape.introspect(shapeData, Targets.Page)
      expect(pageIds).toEqual(['page-id'])

      const fileIds = shape.introspect(shapeData, Targets.File)
      expect(fileIds).toEqual(['file-id'])
    })
  })

  describe('getTranslatableData', () => {
    test('is correctly delegated to subcontrols', () => {
      const shape = Shape({
        type: {
          textArea: TextArea(),
          textInput: TextInput(),
          color: Color({ defaultValue: 'red' }),
        },
      })

      const shapeData = {
        textArea: 'alpha',
        textInput: 'beta',
        color: {
          swatchId: 'swatch-id',
          alpha: 1,
        },
      }

      const translatableData = shape.getTranslatableData(shapeData)
      expect(translatableData).toEqual({
        textArea: 'alpha',
        textInput: 'beta',
        color: null,
      })
    })
  })
})
