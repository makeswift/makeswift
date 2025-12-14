import { configureStore as configureReduxStore, type ThunkAction } from '@reduxjs/toolkit'

import * as IsPreview from './modules/is-preview'

import { withSetupTeardown } from './mixins/setup-teardown'

import { type Action } from './actions'

import { BuilderActionTypes } from './builder-api/actions'
import { middlewareOptions, devToolsConfig } from './toolkit'

import { MakeswiftHostApiClient } from '../api/react'
import { type BuilderAPIProxy } from './builder-api/proxy'
import { HostActionTypes } from './host-api'

import { type State, type Dispatch, createRootReducer } from './read-write-state'

import { readWriteElementTreeMiddleware } from './middleware/read-write-element-tree'
import { measureBoxModelsMiddleware } from './middleware/measure-box-models'
import { builderAPIMiddleware } from './middleware/builder-api'
import { propControllerHandlesMiddleware } from './middleware/prop-controller-handles'
import { makeswiftApiClientSyncMiddleware } from './middleware/makeswift-api-client-sync'

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
    isPreview: IsPreview.getInitialState(true),
  }

  const store = configureReduxStore({
    reducer: createRootReducer(),
    preloadedState: initialState,

    middleware: getDefaultMiddleware =>
      getDefaultMiddleware(middlewareOptions).concat(
        readWriteElementTreeMiddleware(),
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
