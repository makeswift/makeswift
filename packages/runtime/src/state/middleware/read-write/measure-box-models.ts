import { type Middleware } from '@reduxjs/toolkit'

import * as BoxModels from '../../modules/read-write/box-models'
import { type Action } from '../../actions'

import { ReadOnlyActionTypes } from '../../actions/internal/read-only-actions'
import * as ReadWriteActions from '../../actions/internal/read-write-actions'

import { actionMiddleware } from '../../toolkit'

import { type State, type Dispatch } from '../../read-write-state'

export function measureBoxModelsMiddleware(): Middleware<Dispatch, State, Dispatch> {
  return actionMiddleware(({ dispatch }) => next => {
    return (action: Action) => {
      switch (action.type) {
        case ReadOnlyActionTypes.REGISTER_COMPONENT_HANDLE: {
          if (BoxModels.isMeasurable(action.payload.componentHandle)) {
            dispatch(
              ReadWriteActions.registerMeasurable(
                action.payload.documentKey,
                action.payload.elementKey,
                action.payload.componentHandle,
              ),
            )
          }

          break
        }

        case ReadOnlyActionTypes.UNREGISTER_COMPONENT_HANDLE:
          dispatch(
            ReadWriteActions.unregisterMeasurable(
              action.payload.documentKey,
              action.payload.elementKey,
            ),
          )
          break
      }

      return next(action)
    }
  })
}
