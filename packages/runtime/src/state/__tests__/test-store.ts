import { configureStore as configureReduxStore, combineReducers } from '@reduxjs/toolkit'

import * as ReadOnlyState from '../read-only-state'
import { middlewareOptions } from '../toolkit'
import { readOnlyElementTreeMiddleware } from '../middleware/read-only-element-tree'

export function createReadOnlyTestStore() {
  return configureReduxStore({
    reducer: combineReducers(ReadOnlyState.reducers),
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware(middlewareOptions).concat([readOnlyElementTreeMiddleware()]),
  })
}
