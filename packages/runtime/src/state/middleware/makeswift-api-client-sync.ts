import { type Middleware } from '@reduxjs/toolkit'

import { ApiResourcesClient } from '../../api/api-resources-client'

import { type Action } from '../actions'
import { actionMiddleware } from '../toolkit'
import { type State, type Dispatch } from '../unified-state'

export function makeswiftApiClientSyncMiddleware(
  client: ApiResourcesClient,
): Middleware<Dispatch, State, Dispatch> {
  return actionMiddleware(() => next => {
    return (action: Action) => {
      client.store.dispatch(action)

      return next(action)
    }
  })
}
