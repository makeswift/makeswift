import { Action, ActionTypes } from '../actions'

export type State = string

export function getInitialState(): State {
  return ''
}

export function getLocale(state: State): string {
  return state
}

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    case ActionTypes.SET_LOCALE:
      return action.payload.locale

    default:
      return state
  }
}
