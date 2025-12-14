import { type Middleware } from '@reduxjs/toolkit'

import { HostActionTypes } from '../../host-api'
import { changeElementTree } from '../../actions/internal/read-write-actions'

import { actionMiddleware } from '../../toolkit'

import { type Dispatch, type State, getDocument } from '../../read-write-state'
import { getPropControllerDescriptors } from '../../read-only-state'

export function updateElementTreeMiddleware(): Middleware<Dispatch, State, Dispatch> {
  return actionMiddleware(({ dispatch, getState }) => next => {
    return action => {
      switch (action.type) {
        case HostActionTypes.CHANGE_DOCUMENT: {
          const { documentKey, operation } = action.payload

          const oldDocument = getDocument(getState(), documentKey)
          const result = next(action)
          const newDocument = getDocument(getState(), documentKey)

          if (oldDocument != null && newDocument != null && newDocument !== oldDocument) {
            dispatch(
              changeElementTree({
                oldDocument,
                newDocument,
                descriptors: getPropControllerDescriptors(getState()),
                operation,
              }),
            )
          }

          return result
        }
      }

      return next(action)
    }
  })
}
