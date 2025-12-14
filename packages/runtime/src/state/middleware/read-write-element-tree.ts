import { type Middleware } from '@reduxjs/toolkit'

import { ActionTypes } from '../actions'
import { changeElementTree } from '../actions/internal'

import { actionMiddleware } from '../toolkit'

import {
  type Dispatch,
  type State,
  getDocument,
  getPropControllerDescriptors,
} from '../read-only-state'

import { readlOnlyElementTreeMiddleware } from './read-only-element-tree'

export function readWriteElementTreeMiddleware(): Middleware<Dispatch, State, Dispatch> {
  const readOnlyMiddleware = readlOnlyElementTreeMiddleware()

  return actionMiddleware(({ dispatch, getState }) => next => {
    return action => {
      switch (action.type) {
        case ActionTypes.CHANGE_DOCUMENT: {
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

      return readOnlyMiddleware({ dispatch, getState })(next)(action)
    }
  })
}
