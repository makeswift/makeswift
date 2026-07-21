import { type Middleware } from '@reduxjs/toolkit'

import * as PropControllerHandles from '../../modules/prop-controller-handles'

import { type Action } from '../../actions'

import { ReadOnlyActionTypes } from '../../actions/internal/read-only-actions'
import * as ReadOnly from '../../actions/internal/read-only-actions'

import { actionMiddleware } from '../../toolkit'

import { HostActionTypes } from '../../host-api'

import * as ReadOnlyState from '../../read-only-state'
import { type State, type Dispatch } from '../../read-write-state'

export function propControllerHandlesMiddleware(): Middleware<Dispatch, State, Dispatch> {
  return actionMiddleware(({ dispatch, getState }) => next => {
    return (action: Action) => {
      switch (action.type) {
        case ReadOnlyActionTypes.REGISTER_COMPONENT_HANDLE: {
          const { documentKey, elementKey, componentHandle } = action.payload
          const element = ReadOnlyState.getElement(getState(), documentKey, elementKey)
          const propControllers = ReadOnlyState.getPropControllers(getState(), {
            documentKey,
            elementKey,
          })

          if (
            element != null &&
            !ReadOnlyState.isElementReference(element) &&
            PropControllerHandles.isPropControllersHandle(componentHandle)
          ) {
            dispatch(
              ReadOnly.registerPropControllersHandle(documentKey, elementKey, componentHandle),
            )
            componentHandle.setPropControllers(propControllers)
          }

          break
        }

        case ReadOnlyActionTypes.UNREGISTER_COMPONENT_HANDLE: {
          const { documentKey, elementKey } = action.payload
          const handle = ReadOnlyState.getPropControllersHandle(getState(), {
            documentKey,
            elementKey,
          })

          handle?.setPropControllers(null)
          break
        }

        case HostActionTypes.MESSAGE_HOST_PROP_CONTROLLER: {
          const { documentKey, elementKey, propName, message } = action.payload
          const propController = ReadOnlyState.getPropController(getState(), {
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
