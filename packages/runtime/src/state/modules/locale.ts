import { type Action, type UnknownAction, isKnownAction } from '../actions'
import { SharedActionTypes } from '../shared-api'
import { InternalActionTypes } from '../actions/internal'

export type State = string | null

export function getInitialState(locale: string | null = null): State {
  return locale
}

export function getLocale(state: State): string | null {
  return state
}

export function reducer(state = getInitialState(), action: Action | UnknownAction): State {
  if (!isKnownAction(action)) return state

  switch (action.type) {
    case SharedActionTypes.SET_LOCALE:
      return action.payload.locale

    case InternalActionTypes.RESET_LOCALE_STATE:
      return getInitialState()

    default:
      return state
  }
}
