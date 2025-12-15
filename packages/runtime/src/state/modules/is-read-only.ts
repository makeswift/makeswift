import { type Action, type UnknownAction, isKnownAction } from '../actions'
import { InternalActionTypes } from '../actions/internal'

export type State = boolean

export function getInitialState(isReadOnly = true): State {
  return isReadOnly
}

export function getIsReadOnly(state: State): boolean {
  return state
}

export function reducer(state = getInitialState(), action: Action | UnknownAction): State {
  if (!isKnownAction(action)) return state

  switch (action.type) {
    case InternalActionTypes.SET_IS_READ_ONLY:
      return action.payload

    default:
      return state
  }
}
