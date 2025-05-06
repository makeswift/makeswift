import { ControlDataTypeKey } from '../../../common'
import { createReplacementContext, type CopyContext } from '../../../context'
import {
  deserializeRecord,
  type DeserializedRecord,
  type SerializedRecord,
} from '../../../serialization'
import { type DataType } from '../../associated-types'
import { Checkbox, CheckboxDefinition } from '../../checkbox'
import { Color, ColorDefinition } from '../../color'
import { type ControlDefinition } from '../../definition'
import { Group, GroupDefinition } from '../../group'

import { ShapeV2Definition } from './shape-v2'

function deserializer(record: DeserializedRecord): ControlDefinition {
  switch (record.type) {
    case ShapeV2Definition.type:
      return ShapeV2Definition.deserialize(record, deserializer)

    case ColorDefinition.type:
      return ColorDefinition.deserialize(record)

    case CheckboxDefinition.type:
      return CheckboxDefinition.deserialize(record)

    default:
      throw new Error('Invalid control type')
  }
}

describe('ShapeV2', () => {
  test('deserializes to `Group` with `shape-v2::v1` data type', () => {
    const serializedRecord = {
      type: 'makeswift::controls::shape-v2',
      config: {
        label: 'Shape popover',
        layout: 'makeswift::controls::shape-v2::layout::popover',
        type: {
          background: {
            config: {
              label: 'Background color',
            },
            type: 'makeswift::controls::color',
            version: 1,
          },
          shape: {
            type: 'makeswift::controls::shape-v2',
            config: {
              label: 'Inline shape',
              layout: 'makeswift::controls::shape-v2::layout::inline',
              type: {
                checkbox: {
                  config: {
                    label: 'Checkbox',
                  },
                  type: 'makeswift::controls::checkbox',
                  version: 1,
                },
                color: {
                  config: {
                    label: 'Color',
                    defaultValue: 'red',
                  },
                  type: 'makeswift::controls::color',
                  version: 1,
                },
              },
            },
          },
        },
      },
    }

    const group = new GroupDefinition(
      {
        label: 'Shape popover',
        preferredLayout: Group.Layout.Popover,
        props: {
          background: Color({ label: 'Background color' }),
          shape: new GroupDefinition(
            {
              label: 'Inline shape',
              preferredLayout: Group.Layout.Inline,
              props: {
                checkbox: Checkbox({
                  label: 'Checkbox',
                }),
                color: Color({ label: 'Color', defaultValue: 'red' }),
              },
            },
            ShapeV2Definition.v1DataType,
          ),
        },
      },
      ShapeV2Definition.v1DataType,
    )

    const deserialized = ShapeV2Definition.deserialize(
      deserializeRecord(serializedRecord as any as SerializedRecord),
      deserializer,
    )

    expect(deserialized).toStrictEqual(group)
  })

  describe('deserialized `Group` with `shape-v2::v1` data type', () => {
    const shapeV2 = new GroupDefinition(
      {
        label: 'Inline shape',
        preferredLayout: Group.Layout.Inline,
        props: {
          checkbox: Checkbox({
            label: 'Checkbox',
          }),
          color: Color({ label: 'Color', defaultValue: 'red' }),
        },
      },
      ShapeV2Definition.v1DataType,
    )

    const data: DataType<typeof shapeV2> = {
      [ControlDataTypeKey]: ShapeV2Definition.v1DataType,
      value: {
        checkbox: {
          [ControlDataTypeKey]: 'checkbox::v1',
          value: true,
        },
        color: {
          [ControlDataTypeKey]: 'color::v1',
          swatchId: '[swatchId]',
          alpha: 1,
        },
      },
    }

    test('safeParse', () => {
      const result = shapeV2.safeParse(data)

      expect(result.success).toBe(true)
      expect(result.success ? result.data : null).toStrictEqual(data)
    })

    test('fromData', () => {
      const value = shapeV2.fromData(data)

      expect(value).toStrictEqual({
        checkbox: true,
        color: {
          swatchId: '[swatchId]',
          alpha: 1,
        },
      })
    })

    test('toData', () => {
      const result = shapeV2.toData({
        checkbox: true,
        color: {
          swatchId: '[swatchId]',
          alpha: 1,
        },
      })

      expect(result).toStrictEqual(data)
    })

    test('copyData', () => {
      const context: CopyContext = {
        replacementContext: createReplacementContext({
          swatchIds: { '[swatch-id-1]': '[swatch-id-replaced]' },
        }),
        copyElement: (node) => node,
      }

      const copy = shapeV2.copyData(data, context)

      expect(copy).toStrictEqual(data)
    })
  })
})
