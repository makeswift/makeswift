import {
  configureStore as configureReduxStore,
  type ThunkMiddleware,
  UnknownAction,
} from '@reduxjs/toolkit'

import * as LocaleState from '../modules/locale'

import { type Action, ActionTypes } from '../actions'
import { actionMiddleware, middlewareOptions, devToolsConfig } from '../toolkit'

import { type State, reducer } from './state'
import { type Store } from './store'

// FIXME: this middleware can be removed once we've upgraded the builder
// to always provide the locale when dispatching resource actions
function defaultLocaleMiddleware(): ThunkMiddleware<State, UnknownAction> {
  return actionMiddleware(({ getState }) => next => {
    return (action: Action) => {
      switch (action.type) {
        case ActionTypes.CHANGE_API_RESOURCE:
        case ActionTypes.EVICT_API_RESOURCE:
        case ActionTypes.SET_LOCALIZED_RESOURCE_ID: {
          const { locale } = action.payload
          return next({
            ...action,
            payload: {
              ...action.payload,
              locale: locale ?? LocaleState.getLocale(getState().locale),
            },
          } as Action)
        }
      }

      return next(action)
    }
  })
}

export function configureClientStore({
  preloadedState,
}: {
  preloadedState: Partial<State>
}): Store {
  return configureReduxStore({
    reducer,
    preloadedState,

    middleware: getDefaultMiddleware =>
      getDefaultMiddleware(middlewareOptions).concat(defaultLocaleMiddleware()),

    devTools: devToolsConfig({
      name: `API client store (${new Date().toISOString()})`,
      actionsDenylist: [
        ActionTypes.BUILDER_POINTER_MOVE,
        ActionTypes.HANDLE_POINTER_MOVE,
        ActionTypes.ELEMENT_FROM_POINT_CHANGE,
      ],
    }),
  })
}
