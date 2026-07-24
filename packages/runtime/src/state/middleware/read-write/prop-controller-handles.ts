import { type Middleware, type ThunkAction } from '@reduxjs/toolkit'

import { ControlInstance } from '@makeswift/controls'

import * as PropControllers from '../../modules/read-write/prop-controllers'

import { type Action } from '../../actions'

import * as Builder from '../../builder-api/actions'

import { ReadWriteActionTypes } from '../../actions/internal/read-write-action-types'

import { actionMiddleware } from '../../toolkit'

import { createPropController } from '../../../prop-controllers/instances'
import { HostActionTypes } from '../../host-api'

import * as ReadOnlyState from '../../read-only-state'
import {
  type State,
  type Dispatch,
  getPropControllersHandle,
  getPropController,
} from '../../read-write-state'

import {
  registerPropControllers,
  registerPropControllersHandle,
  unregisterPropControllers,
} from '../../actions/internal/read-write-actions'

function createAndRegisterPropControllers(
  documentKey: string,
  elementKey: string,
): ThunkAction<Record<string, ControlInstance> | null, State, unknown, Action> {
  return (dispatch, getState) => {
    const descriptors = ReadOnlyState.getElementPropControllerDescriptors(
      getState(),
      documentKey,
      elementKey,
    )

    if (descriptors == null) return null

    const propControllers = Object.entries(descriptors).reduce(
      (acc, [propName, descriptor]) => {
        const propController = createPropController({
          descriptor,
          instanceKey: { elementKey, propPath: propName },
          sendMessage: message =>
            dispatch(
              Builder.messageBuilderPropController(documentKey, elementKey, propName, message),
            ),
        }) as ControlInstance

        return { ...acc, [propName]: propController }
      },
      {} as Record<string, ControlInstance>,
    )

    dispatch(registerPropControllers(documentKey, elementKey, propControllers))

    return propControllers
  }
}

export function propControllerHandlesMiddleware(): Middleware<Dispatch, State, Dispatch> {
  return actionMiddleware(({ dispatch, getState }) => next => {
    return (action: Action) => {
      switch (action.type) {
        case ReadWriteActionTypes.REGISTER_COMPONENT_HANDLE: {
          const { documentKey, elementKey, componentHandle } = action.payload
          const element = ReadOnlyState.getElement(getState(), documentKey, elementKey)
          const propControllers = dispatch(
            createAndRegisterPropControllers(documentKey, elementKey),
          )

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

          dispatch(unregisterPropControllers(documentKey, elementKey))

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
