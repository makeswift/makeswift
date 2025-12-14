import { type Middleware } from '@reduxjs/toolkit'

import { ActionTypes } from '../actions'
import { createElementTree, deleteElementTree } from '../actions/internal'

import { actionMiddleware } from '../toolkit'

import { type Dispatch, type State, getPropControllerDescriptors } from '../read-only-state'

export function readlOnlyElementTreeMiddleware(): Middleware<Dispatch, State, Dispatch> {
  return actionMiddleware(({ dispatch, getState }) => next => {
    return action => {
      switch (action.type) {
        case ActionTypes.REGISTER_DOCUMENT:
          dispatch(
            createElementTree({
              document: action.payload.document,
              descriptors: getPropControllerDescriptors(getState()),
            }),
          )
          break

        case ActionTypes.UNREGISTER_DOCUMENT:
          dispatch(deleteElementTree(action.payload))
          break
      }

      return next(action)
    }
  })
}
