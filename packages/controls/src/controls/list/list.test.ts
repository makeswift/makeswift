import { TestSerializationVisitor } from '../../testing/test-serialization-visitor'

import { ControlDataTypeKey } from '../../common'
import { Targets } from '../../introspection'
import { deserializeRecord } from '../../serialization'

import { Checkbox } from '../checkbox'
import { Color, ColorDefinition } from '../color'
import { Combobox } from '../combobox'
import { Image } from '../image'
import { GenericLink as Link } from '../link'
import { Number } from '../number'
import { Select } from '../select'
import { Shape } from '../shape'
import { TextArea } from '../text-area'
import { TextInput, TextInputDefinition } from '../text-input'

import { List, ListDefinition } from './'

describe('List', () => {
  describe('constructor', () => {
    describe.each([
      ['Color', Color({ label: 'Color', defaultValue: 'red' })],
      ['Checkbox', Checkbox({ label: 'Checkbox', defaultValue: true })],
      ['Number', Number({ label: 'Number', defaultValue: 1 })],
      ['TextInput', TextInput({ label: 'Text Input', defaultValue: 'alpha' })],
      ['TextArea', TextArea({ label: 'Text Area', defaultValue: 'alpha' })],
      ['Link', Link({ label: 'Link' })],
      ['Image', Image({ label: 'Image' })],
      [
        'Select',
        Select({ label: 'Select', options: [{ value: 'a', label: 'Alpha' }] }),
      ],
      [
        'Combobox',
        Combobox({
          label: 'Combobox',
          getOptions: () => [{ id: '0', value: 'a', label: 'Alpha' }],
        }),
      ],
      [
        'Shape',
        Shape({
          type: {
            checkbox: Checkbox({ defaultValue: true }),
          },
        }),
      ],
      [
        'List',
        List({
          type: List({
            type: Checkbox({ defaultValue: true }),
          }),
        }),
      ],
    ])('list of', (defName, def) => {
      test(`${defName}`, () => {
        const list = List({
          type: def,
        })
        expect(list).toMatchSnapshot()
      })
    })

    test('disallows extraneous properties', () => {
      List({
        type: Checkbox(),
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: ListDefinition) {}
    assignTest(List({ type: Checkbox() }))
    assignTest(List({ type: Color({ label: 'Color', defaultValue: 'red' }) }))
    assignTest(
      List({
        type: List({
          type: Combobox({
            getOptions: () => [{ id: '0', value: 'a', label: 'Alpha' }],
          }),
        }),
      }),
    )
  })

  describe('serialization', () => {
    test('serialize/deserialize list of controls', () => {
      const list = List({
        type: Color({ defaultValue: 'red' }),
        label: 'Color list',
      })

      const serializationVisitor = new TestSerializationVisitor()
      const serialized = list.accept(serializationVisitor)
      expect(serialized).toMatchSnapshot()

      const deserialized = ListDefinition.deserialize(
        deserializeRecord(serialized),
        ColorDefinition.deserialize,
      )
      expect(deserialized).toEqual(list)
    })

    test('serialize/deserialize list of composable controls', () => {
      const list = List({
        type: List({
          type: Color({ defaultValue: 'red' }),
          label: 'Color sub-list',
        }),
        label: 'Color list',
      })

      const serializationVisitor = new TestSerializationVisitor()
      const serialized = list.accept(serializationVisitor)
      expect(serialized).toMatchSnapshot()

      const deserialized = ListDefinition.deserialize(
        deserializeRecord(serialized),
        (data) => ListDefinition.deserialize(data, ColorDefinition.deserialize),
      )
      expect(deserialized).toEqual(list)
    })
  })

  describe('introspection', () => {
    test('is correctly delegated to subcontrols', () => {
      const list = List({
        type: List({
          type: Color({ defaultValue: 'red' }),
        }),
        label: 'Color list',
      })

      const swatchIds = list.introspect(
        [
          {
            id: '000',
            type: ListDefinition.type,
            value: [
              {
                id: '000',
                type: ColorDefinition.type,
                value: {
                  swatchId: 'swatch-id',
                  alpha: 1,
                  [ControlDataTypeKey]: 'color::v1',
                },
              },
            ],
          },
          {
            id: '001',
            type: ListDefinition.type,
            value: [
              {
                id: '000',
                type: ColorDefinition.type,
                value: {
                  swatchId: 'swatch-id-2',
                  alpha: 1,
                  [ControlDataTypeKey]: 'color::v1',
                },
              },
            ],
          },
        ],
        Targets.Swatch,
      )
      expect(swatchIds).toEqual(['swatch-id', 'swatch-id-2'])
    })
  })

  describe('getTranslatableData', () => {
    test('is correctly delegated to subcontrols', () => {
      const list = List({
        type: TextInput({ defaultValue: 'alpha' }),
        label: 'Text list',
      })

      const translatableData = list.getTranslatableData([
        {
          id: '000',
          type: TextInputDefinition.type,
          value: {
            value: 'alpha',
            [ControlDataTypeKey]: 'text-input::v1',
          },
        },
      ])
      expect(translatableData).toEqual({
        '000': {
          value: 'alpha',
          [ControlDataTypeKey]: 'text-input::v1',
        },
      })
    })
  })
})
