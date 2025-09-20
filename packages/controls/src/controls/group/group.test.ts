import { TestMergeTranslationsVisitor } from '../../testing/test-merge-translation-visitor'

import { ControlDataTypeKey } from '../../common'
import { createReplacementContext } from '../../context'
import { Targets } from '../../introspection'
import { deserializeRecord, type DeserializedRecord } from '../../serialization'

import { type DataType, type ValueType } from '../associated-types'
import { Checkbox, CheckboxDefinition } from '../checkbox'
import { Color, ColorDefinition } from '../color'
import { Combobox } from '../combobox'
import { ControlDefinition } from '../definition'
import { Image } from '../image'
import { GenericLink as Link } from '../link'
import { List } from '../list'
import { Number } from '../number'
import { TextArea } from '../text-area'
import { TextInput } from '../text-input'

import { Group, GroupDefinition } from './group'

function deserializer(record: DeserializedRecord): ControlDefinition {
  switch (record.type) {
    case GroupDefinition.type:
      return GroupDefinition.deserialize(record, deserializer)

    case ColorDefinition.type:
      return ColorDefinition.deserialize(record)

    case CheckboxDefinition.type:
      return CheckboxDefinition.deserialize(record)

    default:
      throw new Error('Invalid control type')
  }
}

describe('Group', () => {
  describe('constructor', () => {
    test('heterogenous controls', () => {
      const group = Group({
        props: {
          val: Color({ defaultValue: 'red' }),
          num: Checkbox(),
        },
      })
      expect(group).toMatchSnapshot()
    })

    test('disallows extraneous properties', () => {
      Group({
        props: {
          toggle: Checkbox(),
        },
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: GroupDefinition) {}
    assignTest(
      Group({
        props: {},
        label: 'Group',
      }),
    )

    assignTest(
      Group({
        props: {},
      }),
    )

    assignTest(
      Group({
        props: {
          toggle: Checkbox(),
          color: Color({ defaultValue: 'red' }),
        },
      }),
    )

    assignTest(
      Group({
        props: {
          combo: Combobox({
            getOptions: () => [{ id: '0', value: 'a', label: 'Alpha' }],
          }),
          link: Link({ label: 'Link' }),
        },
      }),
    )
  })

  describe('serialization', () => {
    test('serialize/deserialize layout of controls', () => {
      const group = Group({
        props: {},
        preferredLayout: 'makeswift::controls::group::layout::popover',
      })

      const [serialized, _] = group.serialize()
      expect(serialized).toMatchSnapshot()

      const deserialized = GroupDefinition.deserialize(
        deserializeRecord(serialized),
        deserializer,
      )

      expect(deserialized).toEqual(group)
    })

    test('serialize/deserialize label of controls', () => {
      const group = Group({
        props: {},
        label: 'Group',
      })

      const [serialized, _] = group.serialize()
      expect(serialized).toMatchSnapshot()

      const deserialized = GroupDefinition.deserialize(
        deserializeRecord(serialized),
        deserializer,
      )

      expect(deserialized).toEqual(group)
    })

    test('serialize/deserialize group of controls', () => {
      const group = Group({
        props: {
          color: Color({ defaultValue: 'red' }),
          checkbox: Checkbox(),
        },
      })

      const [serialized, _] = group.serialize()
      expect(serialized).toMatchSnapshot()

      const deserialized = GroupDefinition.deserialize(
        deserializeRecord(serialized),
        deserializer,
      )

      expect(deserialized).toEqual(group)
    })

    test('serialize/deserialize composable group of controls', () => {
      const group = Group({
        props: {
          group: Group({
            props: {
              color: Color({ defaultValue: 'red' }),
              checkbox: Checkbox(),
            },
          }),
        },
      })

      const [serialized, _] = group.serialize()
      expect(serialized).toMatchSnapshot()

      const deserialized = GroupDefinition.deserialize(
        deserializeRecord(serialized),
        deserializer,
      )

      expect(deserialized).toEqual(group)
    })
  })

  describe('introspection', () => {
    test('Group data is correctly delegated to subcontrols', () => {
      const group = Group({
        props: {
          color: Color({ defaultValue: 'red' }),
          link: Link(),
          image: Image(),
        },
      })

      const groupData = {
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

      const swatchIds = group.introspect(groupData, Targets.Swatch)
      expect(swatchIds).toEqual(['swatch-id'])

      const pageIds = group.introspect(groupData, Targets.Page)
      expect(pageIds).toEqual(['page-id'])

      const fileIds = group.introspect(groupData, Targets.File)
      expect(fileIds).toEqual(['file-id'])
    })

    test('Group versioned data is correctly delegated to subcontrols', () => {
      const group = Group({
        props: {
          color: Color({ defaultValue: 'red' }),
          link: Link(),
          image: Image(),
        },
      })

      const groupData = {
        [ControlDataTypeKey]: 'group::v1' as const,
        value: {
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
        },
      }

      const swatchIds = group.introspect(groupData, Targets.Swatch)
      expect(swatchIds).toEqual(['swatch-id'])

      const pageIds = group.introspect(groupData, Targets.Page)
      expect(pageIds).toEqual(['page-id'])

      const fileIds = group.introspect(groupData, Targets.File)
      expect(fileIds).toEqual(['file-id'])
    })
  })

  describe('getTranslatableData', () => {
    test('Group data is correctly delegated to subcontrols', () => {
      const group = Group({
        props: {
          textArea: TextArea(),
          textInput: TextInput(),
          color: Color({ defaultValue: 'red' }),
        },
      })

      const groupData = {
        textArea: 'alpha',
        textInput: 'beta',
        color: {
          swatchId: 'swatch-id',
          alpha: 1,
        },
      }

      const translatableData = group.getTranslatableData(groupData)
      expect(translatableData).toEqual({
        textArea: 'alpha',
        textInput: 'beta',
        color: null,
      })
    })

    test('Group versioned data is correctly delegated to subcontrols', () => {
      const group = Group({
        props: {
          textArea: TextArea(),
          textInput: TextInput(),
          color: Color({ defaultValue: 'red' }),
        },
      })

      const groupData = {
        [ControlDataTypeKey]: 'group::v1' as const,
        value: {
          textArea: 'alpha',
          textInput: 'beta',
          color: {
            swatchId: 'swatch-id',
            alpha: 1,
          },
        },
      }

      const translatableData = group.getTranslatableData(groupData)
      expect(translatableData).toEqual({
        textArea: 'alpha',
        textInput: 'beta',
        color: null,
      })
    })
  })

  describe('Group data gracefully handles missing/extra props', () => {
    const group = Group({
      props: {
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
    } as any as DataType<typeof group>

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
    } as ValueType<typeof group>

    test('fromData', () => expect(group.fromData(data)).toMatchSnapshot())
    test('toData', () => expect(group.toData(value)).toMatchSnapshot())
    test('copyData', () =>
      expect(
        group.copyData(data, {
          replacementContext: createReplacementContext({}),
          copyElement: (node) => node,
        }),
      ).toMatchSnapshot())

    test('getTranslatableData', () =>
      expect(group.getTranslatableData(data)).toMatchSnapshot())

    test('mergeTranslatedData', () => {
      const visitor = new TestMergeTranslationsVisitor({
        translatedData: {},
        mergeTranslatedData: (node) => node,
      })
      expect(group.accept(visitor, data, {})).toMatchSnapshot()
    })

    test('introspect', () =>
      expect(group.introspect(data, Targets.ChildrenElement)).toStrictEqual([]))
  })

  describe('Group versioned data is gracefully handles missing/extra props', () => {
    const group = Group({
      props: {
        color: Color({ defaultValue: 'red' }),
        list: List({ type: Number() }),
        link: Link(),
        text: TextArea(),
      },
    })

    const data = {
      [ControlDataTypeKey]: 'group::v1' as const,
      // missing props + extra prop that should be ignored
      value: {
        color: { swatchId: '[swatch-id]', alpha: 1 },
        text: 'Hello world',
        extraProp: 'extra',
      },
    } as any as DataType<typeof group>

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
    } as ValueType<typeof group>

    test('fromData', () => expect(group.fromData(data)).toMatchSnapshot())
    test('toData', () => expect(group.toData(value)).toMatchSnapshot())
    test('copyData', () =>
      expect(
        group.copyData(data, {
          replacementContext: createReplacementContext({}),
          copyElement: (node) => node,
        }),
      ).toMatchSnapshot())

    test('getTranslatableData', () =>
      expect(group.getTranslatableData(data)).toMatchSnapshot())

    test('mergeTranslatedData', () => {
      const visitor = new TestMergeTranslationsVisitor({
        translatedData: {},
        mergeTranslatedData: (node) => node,
      })

      expect(group.accept(visitor, data, {})).toMatchSnapshot()
    })

    test('introspect', () =>
      expect(group.introspect(data, Targets.ChildrenElement)).toStrictEqual([]))
  })
})
