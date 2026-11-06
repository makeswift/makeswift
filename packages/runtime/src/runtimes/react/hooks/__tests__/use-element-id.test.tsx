/** @jest-environment jsdom */

import { type PropsWithChildren, act } from 'react'
import { renderHook } from '@testing-library/react'

import { registerDocument } from '../../../../state/shared-api'
import { StoreContext } from '../use-store'
import { DocumentKeyContext } from '../use-document-context'
import { useElementId } from '../use-element-id'

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
} from '../../__tests__/__fixtures__/cross-document-element-ids'

const createWrapper =
  (store: ReturnType<typeof createTestStore>, documentKey: string | null) =>
  ({ children }: PropsWithChildren) => (
    <StoreContext.Provider value={store}>
      <DocumentKeyContext.Provider value={documentKey}>{children}</DocumentKeyContext.Provider>
    </StoreContext.Provider>
  )

describe('useElementId', () => {
  test('resolves an element in the same document', () => {
    const store = createTestStore()
    store.dispatch(registerDocument(documentA()))
    store.dispatch(registerDocument(documentB()))

    const { result } = renderHook(() => useElementId(BOX_A_KEY), {
      wrapper: createWrapper(store, DOCUMENT_A),
    })
    expect(result.current).toBe(BOX_A_ID)
  })

  test('resolves an element in a different document registered in the same store', () => {
    const store = createTestStore()
    store.dispatch(registerDocument(documentA()))
    store.dispatch(registerDocument(documentB()))

    const { result } = renderHook(() => useElementId(BOX_B_KEY), {
      wrapper: createWrapper(store, DOCUMENT_A),
    })
    expect(result.current).toBe(BOX_B_ID)
  })

  test('updates when the target document registers after the initial render', () => {
    const store = createTestStore()
    store.dispatch(registerDocument(documentA()))

    const { result } = renderHook(() => useElementId(BOX_B_KEY), {
      wrapper: createWrapper(store, DOCUMENT_A),
    })
    expect(result.current).toBeNull()

    act(() => {
      store.dispatch(registerDocument(documentB()))
    })
    expect(result.current).toBe(BOX_B_ID)
  })

  test('returns null when the element is not in any document', () => {
    const store = createTestStore()
    store.dispatch(registerDocument(documentA()))
    store.dispatch(registerDocument(documentB()))

    const { result } = renderHook(() => useElementId(MISSING_KEY), {
      wrapper: createWrapper(store, DOCUMENT_A),
    })
    expect(result.current).toBeNull()
  })

  test('returns null for a nullish element key', () => {
    const store = createTestStore()
    store.dispatch(registerDocument(documentA()))

    const { result } = renderHook(() => useElementId(null), {
      wrapper: createWrapper(store, DOCUMENT_A),
    })
    expect(result.current).toBeNull()
  })
})
