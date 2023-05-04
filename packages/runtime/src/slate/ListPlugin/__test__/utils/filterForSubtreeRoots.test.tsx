import type { NodeEntry } from 'slate'
import { filterForSubtreeRoots } from '../../utils/filterForSubtreeRoots'
import { ElementUtils } from '../../../utils/element'

describe('filterForSubtreeRoots', () => {
  it('should return nodes which include every other node', () => {
    /**
     *           ROOT
     *         /     \
     *        /       \
     *       A         B
     *     / | \     / | \
     *    A1 A2 A3  B1 B2 B3
     *   /       \         \
     *  A11      A31       B31
     */
    const A: NodeEntry = [ElementUtils.createText(), [0]]
    const A1: NodeEntry = [ElementUtils.createText(), [0, 0]]
    const A11: NodeEntry = [ElementUtils.createText(), [0, 0, 0]]
    const A2: NodeEntry = [ElementUtils.createText(), [0, 1]]
    const A3: NodeEntry = [ElementUtils.createText(), [0, 2]]
    const A31: NodeEntry = [ElementUtils.createText(), [0, 2, 0]]
    const B: NodeEntry = [ElementUtils.createText(), [1]]
    const B1: NodeEntry = [ElementUtils.createText(), [1, 0]]
    const B2: NodeEntry = [ElementUtils.createText(), [1, 1]]
    const B3: NodeEntry = [ElementUtils.createText(), [1, 2]]
    const B31: NodeEntry = [ElementUtils.createText(), [1, 2, 0]]

    expect(filterForSubtreeRoots([A, A1, A2, A3, A11, A31])).toEqual([A])
    expect(filterForSubtreeRoots([A, A1, A2, A3, A11, A31, B1])).toEqual([A, B1])
    expect(filterForSubtreeRoots([A, A1, A2, A3, A11, A31, B1, B2, B3, B31])).toEqual([
      A,
      B1,
      B2,
      B3,
    ])
    expect(filterForSubtreeRoots([A, A1, A2, A3, A11, A31, B, B1, B2, B3, B31])).toEqual([A, B])
  })
})
