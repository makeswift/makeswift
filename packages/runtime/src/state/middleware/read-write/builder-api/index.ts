import { type Middleware } from '@reduxjs/toolkit'

import { type Action } from '../../../actions'

import { BuilderActionTypes } from '../../../builder-api/actions'

import { actionMiddleware } from '../../../toolkit'

import { type BuilderAPIProxy } from '../../../builder-api/proxy'
import { HostActionTypes } from '../../../host-api'

import { type State, type Dispatch } from '../../../read-write-state'
import { initializeBuilderConnection } from './initialize-connection'

export function builderAPIMiddleware(
  builderProxy: BuilderAPIProxy,
): Middleware<Dispatch, State, Dispatch> {
  return actionMiddleware(({ dispatch }) => next => {
    if (typeof window === 'undefined') return (action: Action) => next(action)

    let cleanUp = () => {}
    return (action: Action) => {
      switch (action.type) {
        case BuilderActionTypes.CHANGE_ELEMENT_BOX_MODELS:
        case BuilderActionTypes.MOUNT_COMPONENT:
        case BuilderActionTypes.UNMOUNT_COMPONENT:
        case BuilderActionTypes.CHANGE_DOCUMENT_ELEMENT_SIZE:
        case BuilderActionTypes.MESSAGE_BUILDER_PROP_CONTROLLER:
        case BuilderActionTypes.HANDLE_WHEEL:
        case BuilderActionTypes.HANDLE_POINTER_MOVE:
        case BuilderActionTypes.ELEMENT_FROM_POINT_CHANGE:
        case BuilderActionTypes.SET_LOCALE:
        case BuilderActionTypes.SET_BREAKPOINTS:
        case BuilderActionTypes.REGISTER_BUILDER_DOCUMENT:
        case BuilderActionTypes.UNREGISTER_BUILDER_DOCUMENT:
        case BuilderActionTypes.REGISTER_BUILDER_COMPONENT:
        case BuilderActionTypes.UNREGISTER_BUILDER_COMPONENT:
          builderProxy.execute(action)
          break

        case HostActionTypes.CHANGE_DOCUMENT_ELEMENT_SCROLL_TOP:
          window.document.documentElement.scrollTop = action.payload.scrollTop
          break

        case HostActionTypes.SCROLL_DOCUMENT_ELEMENT:
          window.document.documentElement.scrollTop += action.payload.scrollTopDelta
          break

        case HostActionTypes.SET_BUILDER_EDIT_MODE:
          window.getSelection()?.removeAllRanges()
          break

        case HostActionTypes.INIT:
          // dispatched by the parent window after establishing the connection
          cleanUp = dispatch(initializeBuilderConnection(builderProxy))
          break

        case HostActionTypes.CLEAN_UP:
          // dispatched by the parent window on disconnect
          cleanUp()
          break
      }

      return next(action)
    }
  })
}
