import {
  type Middleware,
  type StoreEnhancer,
  type MiddlewareAPI,
  configureStore as configureReduxStore,
  combineReducers,
  compose,
} from '@reduxjs/toolkit'

import { MakeswiftHostApiClient } from '../api/client'

import { actionMiddleware, middlewareOptions, devToolsConfig } from './toolkit'
import { BuilderActionTypes } from './builder-api/actions'
import { HostActionTypes } from './host-api'

import * as Breakpoints from './modules/breakpoints'

import { readOnlyElementTreeMiddleware } from './middleware/read-only-element-tree'

import { type Action } from './actions'
import { type State as ReadWriteState } from './read-write-state'
import * as ReadOnlyState from './read-only-state'

import {
  type State,
  type Dispatch,
  type ReadOnlyReducer,
  type ReadWriteDispatch,
} from './unified-state'
import { makeswiftApiClientSyncMiddleware } from './middleware/makeswift-api-client-sync'

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
  let middlewares: ReadWriteMiddleware | null = null
  let enhancedDispatch: Dispatch | null = null

  return actionMiddleware(({ dispatch, getState }) => next => {
    return (action: Action) => {
      const state = getState()

      if (middlewareRef.current == null) {
        if (!state.isReadOnly) {
          // because switching to the read-write state is an asynchronous operation,
          // we need to buffer all actions dispatched after the isReadOnly state is
          // set to false but before the read-write middleware is installed
          readWriteActionBuffer.push(action)
        }

        return next(action)
      }

      if (state.isReadOnly) {
        console.error('Read-write state mismatch', {
          isReadOnly: state.isReadOnly,
          middlewareRef: middlewareRef.current,
          siteVersion: state.siteVersion,
        })
      }

      // build and cache the enhanced dispatch chain when read-write middleware is installed
      if (enhancedDispatch == null || middlewares !== middlewareRef.current) {
        middlewares = middlewareRef.current

        const middlewareApi = { dispatch, getState } as MiddlewareAPI<
          ReadWriteDispatch,
          ReadWriteState
        >

        enhancedDispatch = compose<Dispatch>(...middlewares.map(mw => mw(middlewareApi)))(next)
      }

      // dispatch buffered actions, if any
      if (readWriteActionBuffer.length > 0) {
        const readWriteActions = [...readWriteActionBuffer]
        readWriteActionBuffer = []

        // Note that we're rerunning the actions through the entire middleware chain,
        // including the read-only middleware and the reducers, some of which have
        // already processed these actions once. This is safe to do because actions that
        // are run as part of page initialization are idempotent.
        for (const bufferedAction of readWriteActions) {
          enhancedDispatch(bufferedAction)
        }
      }

      return enhancedDispatch(action)
    }
  })
}

interface ReadWriteStateMixin {
  loadReadWriteState: ({ isReadOnly }: { isReadOnly: boolean }) => Promise<() => void>
}

function withReadWriteState(
  loadReadWriteState: ReadWriteStateMixin['loadReadWriteState'],
): StoreEnhancer<ReadWriteStateMixin> {
  return next => (reducer, preloadedState?) => ({
    ...next(reducer, preloadedState),
    loadReadWriteState,
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
  const readWriteMiddlewareRef: ReadWriteMiddlewareRef = {
    current: null,
  }

  let refCount = 0
  let readWriteCleanup: (() => void) | null = null
  let readWriteSetupPromise: Promise<void> | null = null

  const loadReadWriteState = async (): Promise<void> => {
    if (readWriteCleanup != null) {
      return
    }

    if (readWriteSetupPromise != null) {
      await readWriteSetupPromise
      return
    }

    readWriteSetupPromise = (async () => {
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
        return
      }

      store.replaceReducer(createRootReducer() as ReadOnlyReducer)

      const builderProxy = new BuilderAPIProxy({ appOrigin })
      readWriteMiddlewareRef.current = createReadWriteMiddleware({ builderProxy })

      const dispatch = store.dispatch as ReadWriteDispatch
      dispatch(setupBuilderProxy(builderProxy))

      readWriteCleanup = () => {
        readWriteMiddlewareRef.current = null
        builderProxy.teardown()
      }
    })()

    try {
      await readWriteSetupPromise
    } finally {
      readWriteSetupPromise = null
    }
  }

  const store = configureReduxStore({
    reducer: combineReducers(ReadOnlyState.reducers),

    preloadedState: {
      ...preloadedState,
      breakpoints: Breakpoints.getInitialState(breakpoints ?? preloadedState?.breakpoints),
    },

    middleware: getDefaultMiddleware =>
      getDefaultMiddleware(middlewareOptions).concat([
        readOnlyElementTreeMiddleware(),
        makeswiftApiClientSyncMiddleware(hostApiClient),
        conditionalReadWriteMiddleware(readWriteMiddlewareRef),
      ]),

    enhancers: getDefaultEnhancers =>
      getDefaultEnhancers().concat(
        withReadWriteState(async ({ isReadOnly }) => {
          if (isReadOnly) {
            if (refCount > 0) {
              console.error('Read-write state mismatch', {
                isReadOnly,
                refCount,
              })
            }

            return () => {}
          }

          await loadReadWriteState()
          refCount += 1

          let didCleanup = false
          return () => {
            if (didCleanup) {
              return
            }

            didCleanup = true
            refCount -= 1
            if (refCount === 0 && readWriteCleanup != null) {
              readWriteCleanup()
              readWriteCleanup = null
            }
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
