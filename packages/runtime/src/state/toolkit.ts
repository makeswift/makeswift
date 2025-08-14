import {
  type ThunkDispatch,
  type Middleware,
  type UnknownAction,
  type MiddlewareAPI,
  type ConfigureStoreOptions,
} from '@reduxjs/toolkit'

import { type Action, isKnownAction } from './actions'

import { serializeState } from '../utils/serializeState'

export function actionMiddleware<S, A extends UnknownAction = UnknownAction>(
  middleware: (
    api: MiddlewareAPI<ThunkDispatch<S, unknown, A>, S>,
  ) => (next: (action: unknown) => unknown) => (action: Action) => unknown,
): Middleware<unknown, S, ThunkDispatch<S, unknown, A>> {
  return api => next => {
    const m = middleware(api)(next)
    return (action: unknown) => {
      return isKnownAction(action) ? m(action) : next(action)
    }
  }
}

export const middlewareOptions = {
  serializableCheck: false,
  immutableCheck: false,
} as const

type DevToolsOptions = Exclude<ConfigureStoreOptions['devTools'], boolean>

const isDevToolsEnabled = () => process.env.NODE_ENV === 'development'

export function devToolsConfig(options: DevToolsOptions): boolean | DevToolsOptions {
  return isDevToolsEnabled()
    ? {
        serialize: true,
        stateSanitizer: (state: any) => serializeState(state),
        ...options,
      }
    : false
}
