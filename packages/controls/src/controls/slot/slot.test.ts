import { type ResolvedValueType } from '../associated-types'

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
})
