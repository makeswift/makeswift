import { noOpResourceResolver } from '../../testing/mocks/resource-resolver'
import { noOpStylesheet } from '../../testing/mocks/stylesheet'
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

  describe('prop resolution', () => {
    const list = List({
      type: Checkbox(),
    })

    const listData = list.toData([false, false, true, false])
    const instanceKey = { elementKey: '[test-element]', propPath: 'list-prop' }

    const fixtures = () => {
      const listInstance = list.createInstance({
        instanceKey,
        sendMessage: () => {},
      })

      const resolveValueContext = [
        noOpResourceResolver,
        noOpStylesheet,
        listInstance,
      ] as const

      return { listInstance, resolveValueContext }
    }

    test('resolveValue creates a list of child controls with correct instance keys', async () => {
      const { listInstance, resolveValueContext } = fixtures()

      expect(listInstance.childControls().size).toBe(0)

      const resolved = list.resolveValue(listData, ...resolveValueContext)
      await resolved.triggerResolve()

      const childControls = [...listInstance.childControls().values()]

      expect(
        childControls
          .map((c) => c?.elementKey)
          .every((key) => key === instanceKey.elementKey),
      ).toBe(true)

      expect(childControls.map((c) => c?.propPath)).toStrictEqual([
        'list-prop.0',
        'list-prop.1',
        'list-prop.2',
        'list-prop.3',
      ])
    })

    test('resolveValue on unchanged list maintains child control identity', async () => {
      const { listInstance, resolveValueContext } = fixtures()

      const resolved = list.resolveValue(listData, ...resolveValueContext)
      await resolved.triggerResolve()
      const childControls = listInstance.children()

      const resolved2 = list.resolveValue(listData, ...resolveValueContext)
      await resolved2.triggerResolve()
      const childControls2 = listInstance.children()

      childControls2.forEach((item, i) => expect(item).toBe(childControls[i]))
    })

    test('reordering list data recreates child controls with correct prop paths', async () => {
      const { listInstance, resolveValueContext } = fixtures()

      const resolved = list.resolveValue(listData, ...resolveValueContext)
      await resolved.triggerResolve()
      const childControls = listInstance.children()

      const listData2 = [...listData].sort((a, b) => b.id.localeCompare(a.id))
      const resolved2 = list.resolveValue(listData2, ...resolveValueContext)
      await resolved2.triggerResolve()
      const childControls2 = listInstance.children()

      childControls2.forEach((item, i) =>
        expect(item).not.toBe(childControls[i]),
      )

      expect(childControls2.map((c) => c?.propPath)).toStrictEqual([
        'list-prop.0',
        'list-prop.1',
        'list-prop.2',
        'list-prop.3',
      ])
    })

    test('partial reordering of list data recreates only affected child controls', async () => {
      const { listInstance, resolveValueContext } = fixtures()

      const resolved = list.resolveValue(listData, ...resolveValueContext)
      await resolved.triggerResolve()
      const childControls = listInstance.children()

      const listData2 = [listData[0], listData[2], listData[1], listData[3]]
      const resolved2 = list.resolveValue(listData2, ...resolveValueContext)
      await resolved2.triggerResolve()
      const childControls2 = listInstance.children()

      expect(childControls2[0]).toBe(childControls[0])
      expect(childControls2[1]).not.toBe(childControls[1])
      expect(childControls2[1]).not.toBe(childControls[2])
      expect(childControls2[2]).not.toBe(childControls[2])
      expect(childControls2[2]).not.toBe(childControls[1])
      expect(childControls2[3]).toBe(childControls[3])

      expect(childControls2.map((c) => c?.propPath)).toStrictEqual([
        'list-prop.0',
        'list-prop.1',
        'list-prop.2',
        'list-prop.3',
      ])
    })

    test('child controls can be accessed through `child(index)`', async () => {
      const { listInstance, resolveValueContext } = fixtures()

      const resolved = list.resolveValue(listData, ...resolveValueContext)
      await resolved.triggerResolve()
      const childControls = listInstance.children()

      childControls.forEach((c, index) => {
        expect(listInstance.child(`${index}`)).toBe(c)
        expect(listInstance.child(`${index}`)?.propPath).toBe(
          `list-prop.${index}`,
        )
      })
    })

    test('`children` returns a copy of the child controls list', async () => {
      const { listInstance, resolveValueContext } = fixtures()

      const resolved = list.resolveValue(listData, ...resolveValueContext)
      await resolved.triggerResolve()

      const children = listInstance.children()
      expect(children.length).toBe(listInstance.childControls().size)

      expect(listInstance.children()).not.toBe(children)

      listInstance.children().forEach((c, index) => {
        expect(children[index]).toBe(c)
      })
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
