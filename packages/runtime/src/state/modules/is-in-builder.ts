import { type Action, type UnknownAction, ActionTypes, isKnownAction } from '../actions'

export type State = boolean

export function getInitialState(): State {
  return false
}

export function getIsInBuilder(state: State): boolean {
  return state
}

export function reducer(state: State = getInitialState(), action: Action | UnknownAction): State {
  if (!isKnownAction(action)) return state

  switch (action.type) {
    case ActionTypes.SET_IS_IN_BUILDER:
      return action.payload

    default:
      return state
  }
}
