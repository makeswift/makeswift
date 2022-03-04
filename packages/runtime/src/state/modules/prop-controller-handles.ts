import type { Dispatch as ReactDispatch, SetStateAction } from 'react'

import { Action, ActionTypes } from '../actions'
import type { Data } from './read-only-documents'
import { PropController } from '../../prop-controllers/instances'

export type PropsPropControllers<T extends Record<string, Data> = Record<string, Data>> = {
  [K in keyof T]: PropController
}

export interface PropControllersHandle<T extends Record<string, Data> = Record<string, Data>> {
  setPropControllers: ReactDispatch<SetStateAction<PropsPropControllers<T> | null>>
}

export function isPropControllersHandle(value: unknown): value is PropControllersHandle {
  if (
    typeof value === 'object' &&
    value !== null &&
    'setPropControllers' in value &&
    typeof (value as { setPropControllers: unknown }).setPropControllers === 'function'
  ) {
    return true
  }

  return false
}

export type State = {
  handles: Map<string, Map<string, PropControllersHandle>>
  instances: Map<string, Map<string, Record<string, PropController>>>
}

export function getInitialState(): State {
  return { handles: new Map(), instances: new Map() }
}

export function getPropControllersHandle(
  state: State,
  documentKey: string,
  elementKey: string,
): PropControllersHandle | null {
  return state.handles.get(documentKey)?.get(elementKey) ?? null
}

export function getPropController(
  state: State,
  documentKey: string,
  elementKey: string,
  propName: string,
): PropController | null {
  return state.instances.get(documentKey)?.get(elementKey)?.[propName] ?? null
}

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    case ActionTypes.REGISTER_PROP_CONTROLLERS_HANDLE: {
      const { documentKey, elementKey, handle } = action.payload

      return {
        ...state,
        handles: new Map(state.handles).set(
          documentKey,
          new Map(state.handles.get(documentKey) ?? []).set(elementKey, handle),
        ),
      }
    }

    case ActionTypes.UNREGISTER_PROP_CONTROLLERS_HANDLE: {
      const { documentKey, elementKey } = action.payload
      const nextHandles = new Map(state.handles.get(documentKey) ?? [])

      const deleted = nextHandles.delete(elementKey)

      return deleted
        ? { ...state, handles: new Map(state.handles).set(documentKey, nextHandles) }
        : state
    }

    case ActionTypes.REGISTER_PROP_CONTROLLERS: {
      const { documentKey, elementKey, propControllers } = action.payload

      return {
        ...state,
        instances: new Map(state.instances).set(
          documentKey,
          new Map(state.instances.get(documentKey) ?? []).set(elementKey, propControllers),
        ),
      }
    }

    case ActionTypes.UNREGISTER_PROP_CONTROLLERS: {
      const { documentKey, elementKey } = action.payload
      const nextInstances = new Map(state.instances.get(documentKey) ?? [])

      const deleted = nextInstances.delete(elementKey)

      return deleted
        ? { ...state, instances: new Map(state.instances).set(documentKey, nextInstances) }
        : state
    }

    default:
      return state
  }
}
