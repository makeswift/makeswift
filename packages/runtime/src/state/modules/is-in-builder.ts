import { Action, ActionTypes } from '../actions'

export type State = boolean

export function getInitialState(): State {
  return false
}

export function getIsInBuilder(state: State): boolean {
  return state
}

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    case ActionTypes.SET_IS_IN_BUILDER:
      return action.payload

    default:
      return state
  }
}
