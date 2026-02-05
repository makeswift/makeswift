import { type Action, type UnknownAction, isKnownAction } from '../actions'
import { SharedActionTypes } from '../shared-api'
import { ReadOnlyActionTypes } from '../actions/internal/read-only-actions'

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

    case ReadOnlyActionTypes.RESET_LOCALE_STATE:
      return getInitialState()

    default:
      return state
  }
}
