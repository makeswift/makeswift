import type {
  ClassAttributes,
  ComponentClass,
  PropsWithoutRef,
  RefAttributes,
  VoidFunctionComponent,
} from 'react'

import { Action, ActionTypes } from '../actions'

export type ComponentType<P = Record<string, any>, T = any> =
  | ComponentClass<PropsWithoutRef<P> & ClassAttributes<T>>
  | VoidFunctionComponent<PropsWithoutRef<P> & RefAttributes<T>>

export type State = Map<string, ComponentType>

export function getInitialState({
  reactComponents = new Map(),
}: { reactComponents?: Map<string, ComponentType> } = {}): State {
  return reactComponents
}

function getReactComponents(state: State): Map<string, ComponentType> {
  return state
}

export function getReactComponent(state: State, type: string): ComponentType | null {
  return getReactComponents(state).get(type) ?? null
}

export function reducer(state: State = getInitialState(), action: Action) {
  switch (action.type) {
    case ActionTypes.REGISTER_REACT_COMPONENT:
      return new Map(state).set(action.payload.type, action.payload.component)

    case ActionTypes.UNREGISTER_REACT_COMPONENT: {
      const nextState = new Map(state)

      const deleted = nextState.delete(action.payload.type)

      return deleted ? nextState : state
    }

    default:
      return state
  }
}
