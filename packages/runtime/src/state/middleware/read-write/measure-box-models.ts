import { type Middleware } from '@reduxjs/toolkit'

import * as BoxModels from '../../modules/box-models'
import { type Action } from '../../actions'

import { InternalActionTypes } from '../../actions/internal'
import * as Internal from '../../actions/internal'

import { actionMiddleware } from '../../toolkit'

import { type State, type Dispatch } from '../../read-write-state'

export function measureBoxModelsMiddleware(): Middleware<Dispatch, State, Dispatch> {
  return actionMiddleware(({ dispatch }) => next => {
    return (action: Action) => {
      switch (action.type) {
        case InternalActionTypes.REGISTER_COMPONENT_HANDLE: {
          if (BoxModels.isMeasurable(action.payload.componentHandle)) {
            dispatch(
              Internal.registerMeasurable(
                action.payload.documentKey,
                action.payload.elementKey,
                action.payload.componentHandle,
              ),
            )
          }

          break
        }

        case InternalActionTypes.UNREGISTER_COMPONENT_HANDLE:
          dispatch(
            Internal.unregisterMeasurable(action.payload.documentKey, action.payload.elementKey),
          )
          break
      }

      return next(action)
    }
  })
}
