import { type Middleware, type ThunkAction } from '@reduxjs/toolkit'

import { ControlInstance } from '@makeswift/controls'

import * as PropControllerHandles from '../modules/prop-controller-handles'

import { type Action } from '../actions'

import * as Builder from '../builder-api/actions'

import { ReadOnlyActionTypes } from '../actions/internal/read-only-actions'
import * as ReadOnly from '../actions/internal/read-only-actions'

import { actionMiddleware } from '../toolkit'

import { createPropController } from '../../prop-controllers/instances'
import { HostActionTypes } from '../host-api'

import * as ReadOnlyState from '../read-only-state'
import { type State, type Dispatch } from '../read-write-state'

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
        const propController = createPropController(descriptor, message =>
          dispatch(
            Builder.messageBuilderPropController(documentKey, elementKey, propName, message),
          ),
        ) as ControlInstance

        return { ...acc, [propName]: propController }
      },
      {} as Record<string, ControlInstance>,
    )

    dispatch(ReadOnly.registerPropControllers(documentKey, elementKey, propControllers))

    return propControllers
  }
}

export function propControllerHandlesMiddleware(): Middleware<Dispatch, State, Dispatch> {
  return actionMiddleware(({ dispatch, getState }) => next => {
    return (action: Action) => {
      switch (action.type) {
        case ReadOnlyActionTypes.REGISTER_COMPONENT_HANDLE: {
          const { documentKey, elementKey, componentHandle } = action.payload
          const element = ReadOnlyState.getElement(getState(), documentKey, elementKey)
          const propControllers = dispatch(
            createAndRegisterPropControllers(documentKey, elementKey),
          )

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

          dispatch(ReadOnly.unregisterPropControllers(documentKey, elementKey))

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
