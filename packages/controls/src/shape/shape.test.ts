import { Shape, ShapeDefinition } from './shape'
import { Color, ColorDefinition } from '../color'
import { Checkbox, CheckboxDefinition } from '../checkbox'
import { Link } from '../link'
import { Targets } from '../introspect'
import { Image } from '../image'
import { TextArea } from '../text-area'
import { TextInput } from '../text-input'
import { ControlDefinition, SerializedRecord } from '../control-definition'

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
        serialized,
        (record: SerializedRecord): ControlDefinition => {
          if (record.type === ColorDefinition.type) {
            return ColorDefinition.deserialize(record)
          } else if (record.type === CheckboxDefinition.type) {
            return CheckboxDefinition.deserialize(record)
          }
          throw new Error('Invalid control type')
        },
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

      const deserializer: (record: SerializedRecord) => ControlDefinition = (
        record,
      ) => {
        if (record.type === ShapeDefinition.type) {
          return ShapeDefinition.deserialize(
            record,
            (record: SerializedRecord): ControlDefinition => {
              if (record.type === ColorDefinition.type) {
                return ColorDefinition.deserialize(record)
              } else if (record.type === CheckboxDefinition.type) {
                return CheckboxDefinition.deserialize(record)
              }
              throw new Error('Invalid control type')
            },
          )
        }
        throw new Error('Invalid control type')
      }

      const deserialized = ShapeDefinition.deserialize(serialized, deserializer)

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
