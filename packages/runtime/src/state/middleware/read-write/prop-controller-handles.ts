import { type Middleware } from '@reduxjs/toolkit'

import * as PropControllers from '../../modules/read-write/prop-controllers'

import { type Action } from '../../actions'

import { ReadWriteActionTypes } from '../../actions/internal/read-write-action-types'

import { actionMiddleware } from '../../toolkit'
import { HostActionTypes } from '../../host-api'

import * as ReadOnlyState from '../../read-only-state'

import {
  type State,
  type Dispatch,
  getPropControllersHandle,
  getPropController,
  getPropControllers,
} from '../../read-write-state'

import { registerPropControllersHandle } from '../../actions/internal/read-write-actions'

export function propControllerHandlesMiddleware(): Middleware<Dispatch, State, Dispatch> {
  return actionMiddleware(({ dispatch, getState }) => next => {
    return (action: Action) => {
      switch (action.type) {
        case ReadWriteActionTypes.REGISTER_COMPONENT_HANDLE: {
          const { documentKey, elementKey, componentHandle } = action.payload
          const element = ReadOnlyState.getElement(getState(), documentKey, elementKey)
          const propControllers = getPropControllers(getState(), {
            documentKey,
            elementKey,
          })

          if (
            element != null &&
            !ReadOnlyState.isElementReference(element) &&
            PropControllers.isPropControllersHandle(componentHandle)
          ) {
            dispatch(registerPropControllersHandle(documentKey, elementKey, componentHandle))
            componentHandle.setPropControllers(propControllers)
          }

          break
        }

        case ReadWriteActionTypes.UNREGISTER_COMPONENT_HANDLE: {
          const { documentKey, elementKey } = action.payload
          const handle = getPropControllersHandle(getState(), {
            documentKey,
            elementKey,
          })

          handle?.setPropControllers(null)
          break
        }

        case HostActionTypes.MESSAGE_HOST_PROP_CONTROLLER: {
          const { documentKey, elementKey, propName, message } = action.payload
          const propController = getPropController(getState(), {
            documentKey,
            elementKey,
            propName,
          })

          if (propController) propController.recv(message)
        }
      }

      return next(action)
    }
  })
}
