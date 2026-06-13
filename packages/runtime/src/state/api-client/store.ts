import { configureStore as configureReduxStore } from '@reduxjs/toolkit'

import { type State, reducer } from './state'

export function configureStore({ preloadedState }: { preloadedState: Partial<State> }) {
  return configureReduxStore({
    reducer,
    preloadedState,
  })
}

export type Store = ReturnType<typeof configureStore>
