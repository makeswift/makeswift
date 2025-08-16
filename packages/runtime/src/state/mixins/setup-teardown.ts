import { type StoreEnhancer } from '@reduxjs/toolkit'

export interface SetupTeardownMixin {
  setup: () => void
  teardown: () => void
}

export function withSetupTeardown(
  setup: () => void,
  teardown: () => void,
): StoreEnhancer<SetupTeardownMixin> {
  return next => (reducer, preloadedState?) => ({
    ...next(reducer, preloadedState),
    setup,
    teardown,
  })
}
