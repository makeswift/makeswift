import { registerDocument } from '../shared-api'
import { resolveElementId } from '../read-only-state'

import {
  BOX_A_ID,
  BOX_A_KEY,
  BOX_B_ID,
  BOX_B_KEY,
  DOCUMENT_A,
  DOCUMENT_B,
  MISSING_KEY,
  createTestStore,
  documentA,
  documentB,
} from '../../runtimes/react/__tests__/__fixtures__/cross-document-element-ids'

describe('resolveElementId', () => {
  const createState = () => {
    const store = createTestStore()
    store.dispatch(registerDocument(documentA()))
    store.dispatch(registerDocument(documentB()))
    return store.getState()
  }

  describe('scoped to a document', () => {
    test('resolves an element in that document', () => {
      const state = createState()
      expect(resolveElementId({ state, documentKey: DOCUMENT_A, elementKey: BOX_A_KEY })).toBe(
        BOX_A_ID,
      )
      expect(resolveElementId({ state, documentKey: DOCUMENT_B, elementKey: BOX_B_KEY })).toBe(
        BOX_B_ID,
      )
    })

    test('does not resolve an element in a different document', () => {
      const state = createState()
      expect(resolveElementId({ state, documentKey: DOCUMENT_A, elementKey: BOX_B_KEY })).toBeNull()
    })

    test('returns null for an unregistered document', () => {
      const state = createState()
      expect(
        resolveElementId({ state, documentKey: 'unknown-document', elementKey: BOX_A_KEY }),
      ).toBeNull()
    })
  })

  describe('across all documents', () => {
    test('resolves elements in any registered document', () => {
      const state = createState()
      expect(resolveElementId({ state, documentKey: null, elementKey: BOX_A_KEY })).toBe(BOX_A_ID)
      expect(resolveElementId({ state, documentKey: null, elementKey: BOX_B_KEY })).toBe(BOX_B_ID)
    })

    test('returns null when the element is not in any document', () => {
      const state = createState()
      expect(resolveElementId({ state, documentKey: null, elementKey: MISSING_KEY })).toBeNull()
    })
  })
})
