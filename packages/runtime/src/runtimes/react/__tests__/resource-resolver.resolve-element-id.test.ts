import { registerDocument } from '../../../state/shared-api'
import { createResourceResolver } from '../resource-resolver'

import {
  BOX_A_ID,
  BOX_A_KEY,
  BOX_B_ID,
  BOX_B_KEY,
  DOCUMENT_A,
  MISSING_KEY,
  createTestStore,
  documentA,
  documentB,
} from './__fixtures__/cross-document-element-ids'

const createResolver = (store: ReturnType<typeof createTestStore>, documentKey: string | null) =>
  createResourceResolver({ store, apiClient: {} as any, documentKey, locale: null })

describe('createResourceResolver.resolveElementId', () => {
  test('resolves an element in the same document', () => {
    const store = createTestStore()
    store.dispatch(registerDocument(documentA()))
    store.dispatch(registerDocument(documentB()))

    const resource = createResolver(store, DOCUMENT_A).resolveElementId(BOX_A_KEY)
    expect(resource.readStable()).toBe(BOX_A_ID)
  })

  test('resolves an element in a different document registered in the same store', () => {
    const store = createTestStore()
    store.dispatch(registerDocument(documentA()))
    store.dispatch(registerDocument(documentB()))

    const resource = createResolver(store, DOCUMENT_A).resolveElementId(BOX_B_KEY)
    expect(resource.readStable()).toBe(BOX_B_ID)
  })

  test('resolves an element when there is no current document', () => {
    const store = createTestStore()
    store.dispatch(registerDocument(documentB()))

    const resource = createResolver(store, null).resolveElementId(BOX_B_KEY)
    expect(resource.readStable()).toBe(BOX_B_ID)
  })

  test('notifies subscribers when the target document registers after the link resolves', () => {
    const store = createTestStore()
    store.dispatch(registerDocument(documentA()))

    const resource = createResolver(store, DOCUMENT_A).resolveElementId(BOX_B_KEY)
    expect(resource.readStable()).toBeNull()

    const onUpdate = jest.fn()
    const unsubscribe = resource.subscribe(onUpdate)

    store.dispatch(registerDocument(documentB()))

    expect(onUpdate).toHaveBeenCalled()
    expect(resource.readStable()).toBe(BOX_B_ID)

    unsubscribe()
  })

  test('returns null when the element is not in any document', () => {
    const store = createTestStore()
    store.dispatch(registerDocument(documentA()))
    store.dispatch(registerDocument(documentB()))

    const resource = createResolver(store, DOCUMENT_A).resolveElementId(MISSING_KEY)
    expect(resource.readStable()).toBeNull()
  })
})
