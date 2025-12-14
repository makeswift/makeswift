import { configureStore as configureReduxStore, combineReducers } from '@reduxjs/toolkit'

import * as Breakpoints from './modules/breakpoints'

import { middlewareOptions, devToolsConfig } from './toolkit'

import { withSetupTeardown } from './mixins/setup-teardown'
import { readOnlyElementTreeMiddleware } from './middleware/read-only-element-tree'

import { type State, reducers } from './read-only-state'

export function configureStore({
  name,
  preloadedState,
  breakpoints,
}: {
  name: string
  preloadedState: Partial<State> | null
  breakpoints?: Breakpoints.State
}) {
  return configureReduxStore({
    reducer: combineReducers(reducers),
    preloadedState: {
      ...preloadedState,
      breakpoints: Breakpoints.getInitialState(breakpoints ?? preloadedState?.breakpoints),
    },

    middleware: getDefaultMiddleware =>
      getDefaultMiddleware(middlewareOptions).concat(readOnlyElementTreeMiddleware()),

    enhancers: getDefaultEnhancers =>
      getDefaultEnhancers().concat(
        withSetupTeardown(
          () => {},
          () => {},
        ),
      ),

    devTools: devToolsConfig({
      name: `${name} (${new Date().toISOString()})`,
    }),
  })
}

export type Store = ReturnType<typeof configureStore>
