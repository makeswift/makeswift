import { configureStore as configureReduxStore } from '@reduxjs/toolkit'
import { type Element } from '@makeswift/controls'

import { createReactRuntime } from '../../testing/react-runtime'
import { middlewareOptions } from '../../../../state/toolkit'
import { createRootReducer } from '../../../../state/read-write-state'
import { readOnlyElementTreeMiddleware } from '../../../../state/middleware/read-only-element-tree'
import { createBaseDocument } from '../../../../state/read-only-state'
import { type Store } from '../../../../state/store'

export const DOCUMENT_A = 'document-a'
export const DOCUMENT_B = 'document-b'

export const BOX_A_KEY = 'a7a1b1c2-0000-4000-8000-00000000000a'
export const BOX_B_KEY = 'b7b1b1c2-0000-4000-8000-00000000000b'
export const MISSING_KEY = 'c7c1b1c2-0000-4000-8000-00000000000c'

export const BOX_A_ID = 'box-in-a'
export const BOX_B_ID = 'box-in-b'

const boxWithId = (key: string, id: string): Element => ({
  key,
  type: './components/Box/index.js',
  props: {
    id: { '@@makeswift/type': 'prop-controllers::element-id::v1', value: id },
  },
})

export const documentA = () => createBaseDocument(DOCUMENT_A, boxWithId(BOX_A_KEY, BOX_A_ID), null)
export const documentB = () => createBaseDocument(DOCUMENT_B, boxWithId(BOX_B_KEY, BOX_B_ID), null)

// a minimal store with the built-in component descriptors registered and the element-tree
// middleware installed, sufficient for `getState`/`subscribe`-based element ID lookups
export function createTestStore(): Store {
  const runtime = createReactRuntime()
  return configureReduxStore({
    reducer: createRootReducer(),
    preloadedState: runtime.protoStore.getState(),
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware(middlewareOptions).concat(readOnlyElementTreeMiddleware()),
  }) as unknown as Store
}
