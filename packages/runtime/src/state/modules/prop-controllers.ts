import { Action, ActionTypes } from '../actions'
import { PropControllerDescriptor } from '../../prop-controllers'

export type { PropControllerDescriptor }

export type State = Map<string, Record<string, PropControllerDescriptor>>

export function getInitialState({
  propControllerDescriptors = new Map(),
}: {
  propControllerDescriptors?: Map<string, Record<string, PropControllerDescriptor>>
} = {}): State {
  return propControllerDescriptors
}

export function getPropControllerDescriptors(
  state: State,
): Map<string, Record<string, PropControllerDescriptor>> {
  return state
}

export function getComponentPropControllerDescriptors(
  state: State,
  componentType: string,
): Record<string, PropControllerDescriptor> | null {
  return getPropControllerDescriptors(state).get(componentType) ?? null
}

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    case ActionTypes.REGISTER_COMPONENT:
      return new Map(state).set(action.payload.type, action.payload.propControllerDescriptors)

    case ActionTypes.UNREGISTER_COMPONENT: {
      const nextState = new Map(state)

      const deleted = nextState.delete(action.payload.type)

      return deleted ? nextState : state
    }

    default:
      return state
  }
}
