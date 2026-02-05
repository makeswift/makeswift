import { type Middleware } from '@reduxjs/toolkit'

import { MakeswiftHostApiClient } from '../../../api/client'

import { type Action } from '../../actions'
import { actionMiddleware } from '../../toolkit'
import { type State, type Dispatch } from '../../read-write-state'

export function makeswiftApiClientSyncMiddleware(
  client: MakeswiftHostApiClient,
): Middleware<Dispatch, State, Dispatch> {
  return actionMiddleware(() => next => {
    return (action: Action) => {
      client.makeswiftApiClient.dispatch(action)

      return next(action)
    }
  })
}
