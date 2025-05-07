import { createReplacementContext } from '../../../context'
import { Targets } from '../../../introspection'
import {
  deserializeRecord,
  type DeserializedRecord,
} from '../../../serialization'
import { type DataType, type ValueType } from '../../associated-types'
import { Checkbox, CheckboxDefinition } from '../../checkbox'
import { Color, ColorDefinition } from '../../color'
import { Combobox } from '../../combobox'
import { ControlDefinition } from '../../definition'
import { Image } from '../../image'
import { GenericLink as Link } from '../../link'
import { List } from '../../list'
import { Number } from '../../number'
import { TextArea } from '../../text-area'
import { TextInput } from '../../text-input'

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

  describe('gracefully handles missing/extra props', () => {
    const shape = Shape({
      type: {
        color: Color({ defaultValue: 'red' }),
        list: List({ type: Number() }),
        link: Link(),
        text: TextArea(),
      },
    })

    const data = {
      // missing props + extra prop that should be ignored
      color: { swatchId: '[swatch-id]', alpha: 1 },
      text: 'Hello world',
      extraProp: 'extra',
    } as any as DataType<typeof shape>

    const value = {
      color: { swatchId: '[swatch-id]', alpha: 1 },
      list: [17],
      link: {
        type: 'OPEN_PAGE',
        payload: { pageId: '[page-id]', openInNewTab: false },
      },
      text: 'Hello world',
      // extra prop only, `toData` doesn't handle missing props
      extraProp: 'extra',
    } as ValueType<typeof shape>

    test('fromData', () => expect(shape.fromData(data)).toMatchSnapshot())
    test('toData', () => expect(shape.toData(value)).toMatchSnapshot())
    test('copyData', () =>
      expect(
        shape.copyData(data, {
          replacementContext: createReplacementContext({}),
          copyElement: (node) => node,
        }),
      ).toMatchSnapshot())

    test('getTranslatableData', () =>
      expect(shape.getTranslatableData(data)).toMatchSnapshot())

    test('mergeTranslatedData', () =>
      expect(
        shape.mergeTranslatedData(
          data,
          {},
          {
            translatedData: {},
            mergeTranslatedData: (node) => node,
          },
        ),
      ).toMatchSnapshot())

    test('introspect', () =>
      expect(shape.introspect(data, Targets.ChildrenElement)).toStrictEqual([]))
  })
})
