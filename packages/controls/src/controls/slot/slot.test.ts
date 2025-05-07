import { createReplacementContext } from '../../context'

import { DataType, type ResolvedValueType } from '../associated-types'

import { renderedNode, Slot, SlotDefinition } from './testing'

describe('Slot', () => {
  describe('constructor', () => {
    test('resolved value type', () => {
      const slot = Slot()
      const node: ResolvedValueType<typeof slot> = renderedNode

      expect(slot).toMatchSnapshot()
      expect(node).toBe(renderedNode)
    })

    test('disallows extraneous properties', () => {
      // @ts-expect-error
      Slot({
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: SlotDefinition) {}
    assignTest(Slot())
  })

  describe('copyData', () => {
    test('removes element references marked for deletion', () => {
      const data: DataType<SlotDefinition> = {
        elements: [
          { key: '1', type: 'component', props: {} },
          { key: '2', type: 'reference', value: '[global-element-1]' },
        ],
        columns: [],
      }

      const slot = Slot()

      // Act
      const copy = slot.copyData(data, {
        replacementContext: createReplacementContext({
          globalElementIds: { '[global-element-1]': null },
        }),
        copyElement: (el) => el,
      })

      // Assert
      expect(copy).toEqual({
        elements: [{ key: '1', type: 'component', props: {} }],
        columns: [],
      })
    })
  })
})
