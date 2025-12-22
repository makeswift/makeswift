import {
  type Middleware,
  type StoreEnhancer,
  configureStore as configureReduxStore,
  combineReducers,
} from '@reduxjs/toolkit'

import { MakeswiftHostApiClient } from '../api/client'

import { actionMiddleware, middlewareOptions, devToolsConfig } from './toolkit'
import { BuilderActionTypes } from './builder-api/actions'
import { HostActionTypes } from './host-api'

import * as Breakpoints from './modules/breakpoints'

import { readOnlyElementTreeMiddleware } from './middleware/read-only-element-tree'

import { type Action } from './actions'
import * as ReadOnlyState from './read-only-state'
import { type State, type Dispatch } from './unified-state'
import { setIsReadOnly } from './actions/internal'

type ReadWriteMiddleware = ReturnType<
  typeof import('./middleware/read-write').createReadWriteMiddleware
>

type ReadWriteMiddlewareRef = {
  current: ReadWriteMiddleware | null
}

export function conditionalReadWriteMiddleware(
  middlewareRef: ReadWriteMiddlewareRef,
): Middleware<Dispatch, State, Dispatch> {
  return actionMiddleware(({ dispatch, getState }) => next => {
    return (action: Action) => {
      const state = getState()
      if (state.isReadOnly || middlewareRef.current == null) {
        return next(action)
      }

      const middlewares = middlewareRef.current.map(mw => mw({ dispatch, getState } as any))
      const middlewareChain = middlewares.reduce(
        (chain, mw) => (nextFn: (action: unknown) => unknown) => mw(chain(nextFn)),
        (nextFn: (action: unknown) => unknown) => nextFn,
      )

      return middlewareChain(next)(action)
    }
  })
}

interface SetupMixin {
  setup: ({ isReadOnly }: { isReadOnly: boolean }) => Promise<() => void>
}

function withSetup(setup: SetupMixin['setup']): StoreEnhancer<SetupMixin> {
  return next => (reducer, preloadedState?) => ({
    ...next(reducer, preloadedState),
    setup,
  })
}

export function configureStore({
  name,
  appOrigin,
  hostApiClient,
  preloadedState,
  breakpoints,
}: {
  name: string
  appOrigin: string
  hostApiClient: MakeswiftHostApiClient
  preloadedState: Partial<State> | null
  breakpoints?: Breakpoints.State
}) {
  // TODO: move into its own hook, `useSetupEnhancer`
  const readWriteMiddlewareRef: ReadWriteMiddlewareRef = {
    current: null,
  }

  const store = configureReduxStore({
    reducer: combineReducers({
      ...ReadOnlyState.reducers,
    }),

    preloadedState: {
      ...preloadedState,
      breakpoints: Breakpoints.getInitialState(breakpoints ?? preloadedState?.breakpoints),
    },

    middleware: getDefaultMiddleware =>
      getDefaultMiddleware(middlewareOptions).concat([
        readOnlyElementTreeMiddleware(),
        conditionalReadWriteMiddleware(readWriteMiddlewareRef),
      ]),

    enhancers: getDefaultEnhancers =>
      getDefaultEnhancers().concat(
        withSetup(async ({ isReadOnly }) => {
          if (isReadOnly) {
            return () => {}
          }

          // import all the modules needed for read-write mode before proceeding with
          // the setup to avoid race conditions when `setup` is called concurrently
          // in two different page regions
          const { BuilderAPIProxy } = await import('./builder-api/proxy')
          const { createRootReducer, setupBuilderProxy } = await import('./read-write-state')
          const { createReadWriteMiddleware } = await import('./middleware/read-write')

          // IMPORTANT: only synchronous code after this point

          // with all modules imported, check if another concurrent setup already
          // initialized the read-write middleware
          if (readWriteMiddlewareRef.current != null) {
            return () => {}
          }

          store.replaceReducer(createRootReducer() as any)

          const builderProxy = new BuilderAPIProxy({ appOrigin })
          readWriteMiddlewareRef.current = createReadWriteMiddleware({
            hostApiClient,
            builderProxy,
          })

          const dispatch = store.dispatch as Dispatch
          dispatch(setupBuilderProxy(builderProxy) as any)
          dispatch(setIsReadOnly(false))

          return () => {
            dispatch(setIsReadOnly(true))
            readWriteMiddlewareRef.current = null
            builderProxy.teardown()
          }
        }),
      ),

    devTools: devToolsConfig({
      name: `${name} (${new Date().toISOString()})`,
      actionsDenylist: [
        HostActionTypes.BUILDER_POINTER_MOVE,
        BuilderActionTypes.HANDLE_POINTER_MOVE,
        BuilderActionTypes.ELEMENT_FROM_POINT_CHANGE,
      ],
    }),
  })

  return store
}

export type Store = ReturnType<typeof configureStore>
