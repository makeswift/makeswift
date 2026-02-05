import { configureStore as configureReduxStore, type ThunkAction } from '@reduxjs/toolkit'

import { withSetupTeardown } from './mixins/setup-teardown'

import { type Action } from './actions'

import { BuilderActionTypes } from './builder-api/actions'
import { middlewareOptions, devToolsConfig } from './toolkit'

import { MakeswiftHostApiClient } from '../api/react'
import { type BuilderAPIProxy } from './builder-api/proxy'
import { HostActionTypes } from './host-api'

import { type State, type Dispatch, createRootReducer } from './read-write-state'
import * as IsReadOnly from './modules/is-read-only'

import { propControllerHandlesMiddleware } from './middleware/prop-controller-handles'
import { readOnlyElementTreeMiddleware } from './middleware/read-only-element-tree'

import { updateElementTreeMiddleware } from './middleware/read-write/update-element-tree'
import { measureBoxModelsMiddleware } from './middleware/read-write/measure-box-models'
import { builderAPIMiddleware } from './middleware/read-write/builder-api'
import { makeswiftApiClientSyncMiddleware } from './middleware/read-write/makeswift-api-client-sync'

function setupBuilderProxy(
  builderProxy: BuilderAPIProxy,
): ThunkAction<void, State, unknown, Action> {
  return dispatch => {
    builderProxy.setup({ onHostAction: action => dispatch(action) })
  }
}

export function configureStore({
  preloadedState,
  client,
  builderProxy,
}: {
  preloadedState: Partial<State>
  client: MakeswiftHostApiClient
  builderProxy: BuilderAPIProxy
}) {
  const initialState: Partial<State> = {
    ...preloadedState,
    isReadOnly: IsReadOnly.getInitialState(false),
  }

  const store = configureReduxStore({
    reducer: createRootReducer(),
    preloadedState: initialState,

    middleware: getDefaultMiddleware =>
      getDefaultMiddleware(middlewareOptions).concat(
        readOnlyElementTreeMiddleware(),
        updateElementTreeMiddleware(),
        measureBoxModelsMiddleware(),
        builderAPIMiddleware(builderProxy),
        propControllerHandlesMiddleware(),
        makeswiftApiClientSyncMiddleware(client),
      ),

    enhancers: getDefaultEnhancers =>
      getDefaultEnhancers().concat(
        withSetupTeardown(
          () => {
            const dispatch = store.dispatch as Dispatch
            dispatch(setupBuilderProxy(builderProxy))
          },
          () => builderProxy.teardown(),
        ),
      ),

    devTools: devToolsConfig({
      name: `Host store (${new Date().toISOString()})`,
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
