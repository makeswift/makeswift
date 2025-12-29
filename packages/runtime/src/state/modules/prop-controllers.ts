import { type Action, type UnknownAction, isKnownAction } from '../actions'
import { ReadOnlyActionTypes } from '../actions/internal/read-only-actions'

import { Descriptor as PropControllerDescriptor } from '../../prop-controllers/descriptors'

export type { PropControllerDescriptor }

export type DescriptorsByProp = Record<string, PropControllerDescriptor>
export type DescriptorsByComponentType = Map<string, DescriptorsByProp>
export type State = DescriptorsByComponentType

export function getInitialState({
  propControllerDescriptors = new Map(),
}: {
  propControllerDescriptors?: State
} = {}): State {
  return propControllerDescriptors
}

export function getPropControllerDescriptors(state: State): State {
  return state
}

export function getComponentPropControllerDescriptors(
  state: State,
  componentType: string,
): DescriptorsByProp | null {
  return getPropControllerDescriptors(state).get(componentType) ?? null
}

export function reducer(state: State = getInitialState(), action: Action | UnknownAction): State {
  if (!isKnownAction(action)) return state

  switch (action.type) {
    case ReadOnlyActionTypes.REGISTER_COMPONENT:
      return new Map(state).set(action.payload.type, action.payload.propControllerDescriptors)

    case ReadOnlyActionTypes.UNREGISTER_COMPONENT: {
      const nextState = new Map(state)
      const deleted = nextState.delete(action.payload.type)
      return deleted ? nextState : state
    }

    default:
      return state
  }
}
