import { ControlInstance } from '@makeswift/controls'
import { type Action, type UnknownAction, ActionTypes, isKnownAction } from '../actions'
import type { DescriptorsPropControllers } from '../../prop-controllers/instances'
import type { Descriptor } from '../../prop-controllers/descriptors'

export interface PropControllersHandle<
  T extends Record<string, Descriptor> = Record<string, Descriptor>,
> {
  setPropControllers(propControllers: DescriptorsPropControllers<T> | null): void
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
  instances: Map<string, Map<string, Record<string, ControlInstance>>>
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

export function getPropControllers(
  state: State,
  documentKey: string,
  elementKey: string,
): Record<string, ControlInstance> | null {
  return state.instances.get(documentKey)?.get(elementKey) ?? null
}

export function getPropController(
  state: State,
  documentKey: string,
  elementKey: string,
  propName: string,
): ControlInstance | null {
  return getPropControllers(state, documentKey, elementKey)?.[propName] ?? null
}

export function reducer(state: State = getInitialState(), action: Action | UnknownAction): State {
  if (!isKnownAction(action)) return state

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
