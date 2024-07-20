import { List, ListDefinition } from './list'
import { Color, ColorDefinition } from '../color'
import { Checkbox } from '../checkbox'
import { Number } from '../number'
import { TextArea } from '../text-area'
import { TextInput, TextInputDefinition } from '../text-input'
import { Link } from '../link'
import { Image } from '../image'
import { Select } from '../select'
import { Combobox } from '../combobox'
import { Shape } from '../shape'
import { Targets } from '../introspect'
import { ControlDataTypeKey } from '../common'
import { DataType, ResolvedValueType, ValueType } from '../control-definition'

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
  })

  describe('infers types from config', () => {
    test('infers type from single control', () => {
      const def = List({
        type: Color({ label: 'Color', defaultValue: 'red' }),
      })

      type Value = ValueType<typeof def>
      type Data = DataType<typeof def>
      type ResolvedValue = ResolvedValueType<typeof def>

      const validValue: Value = [
        { swatchId: 'swatch-id', alpha: 1 },
      ] satisfies Value

      const validData: Data = [
        {
          id: '000',
          type: ColorDefinition.type,
          value: {
            swatchId: 'swatch-id',
            alpha: 1,
            [ControlDataTypeKey]: 'color::v1',
          },
        },
      ] satisfies Data

      const validResolvedValue: ResolvedValue = [
        'rgba(255, 0, 0, 1)',
      ] satisfies ResolvedValue

      expect(validValue).toMatchSnapshot()
      expect(validData).toMatchSnapshot()
      expect(validResolvedValue).toMatchSnapshot()

      // TODO: @arvin - add negative assertion tests
    })

    test('infers type from composable control definition', () => {
      const def = List({
        type: List({
          type: Color({ label: 'Color', defaultValue: 'red' }),
        }),
      })

      type Value = ValueType<typeof def>
      type Data = DataType<typeof def>
      type ResolvedValue = ResolvedValueType<typeof def>

      const validValue: Value = [[{ swatchId: 'swatch-id', alpha: 1 }]]
      const validData: Data = [
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
      ]
      const validResolvedValue: ResolvedValue = [['rgba(255, 0, 0, 1)']]

      expect(validValue).toMatchSnapshot()
      expect(validData).toMatchSnapshot()
      expect(validResolvedValue).toMatchSnapshot()
    })
  })

  describe('serialization', () => {
    test('serialize/deserialize list of controls', () => {
      const list = List({
        type: Color({ defaultValue: 'red' }),
        label: 'Color list',
      })

      const [serialized, _] = list.serialize()
      expect(serialized).toMatchSnapshot()

      const deserialized = ListDefinition.deserialize(
        serialized,
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

      const [serialized, _] = list.serialize()
      expect(serialized).toMatchSnapshot()

      const deserialized = ListDefinition.deserialize(serialized, (data) =>
        ListDefinition.deserialize(data, ColorDefinition.deserialize),
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
