import { type Action, type UnknownAction, isKnownAction } from '../actions'
import { ReadOnlyActionTypes } from '../actions/internal/read-only-actions'

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
    case ReadOnlyActionTypes.SET_IS_IN_BUILDER:
      return action.payload

    default:
      return state
  }
}
