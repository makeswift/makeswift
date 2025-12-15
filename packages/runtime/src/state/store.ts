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
import { setIsReadOnly } from './actions/internal/read-only-actions'

type ReadWriteMiddleware = ReturnType<
  typeof import('./middleware/read-write').createReadWriteMiddleware
>

type ReadWriteMiddlewareRef = {
  current: ReadWriteMiddleware | null
}

export function conditionalReadWriteMiddleware(
  middlewareRef: ReadWriteMiddlewareRef,
): Middleware<Dispatch, State, Dispatch> {
  let readWriteActionBuffer: Action[] = []

  return actionMiddleware(({ dispatch, getState }) => next => {
    return (action: Action) => {
      const state = getState()
      if (state.isReadOnly || middlewareRef.current == null) {
        // because switching to the read-write state is an asynchronous operation,
        // we need to buffer all actions dispatched after the site version is set
        // but before the read-write middleware is installed
        if (state.siteVersion != null) {
          readWriteActionBuffer.push(action)
        }

        return next(action)
      }

      if (state.siteVersion == null) {
        console.error('Read-write state mismatch', {
          siteVersion: state.siteVersion,
          isReadOnly: state.isReadOnly,
        })
      }

      const middlewares = middlewareRef.current.map(mw => mw({ dispatch, getState } as any))
      const middlewareChain = middlewares.reduce(
        (chain, mw) => (nextFn: (action: unknown) => unknown) => mw(chain(nextFn)),
        (nextFn: (action: unknown) => unknown) => nextFn,
      )

      // dispatch buffered actions, if any
      if (readWriteActionBuffer.length > 0) {
        const readWriteActions = [...readWriteActionBuffer]
        readWriteActionBuffer = []

        // Note that we're rerunning the actions through the entire middleware chain,
        // including the read-only middleware and the reducers, some of which have
        // already processed these actions once. This is safe to do because actions that
        // are run as part of page initialization are idempotent.

        const middlewareDispatch = middlewareChain(next)
        for (const bufferedAction of readWriteActions) {
          middlewareDispatch(bufferedAction)
        }
      }

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
