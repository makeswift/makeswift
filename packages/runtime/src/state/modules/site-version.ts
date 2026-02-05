import { type SiteVersion } from '../../api/site-version'
import { type Action, type UnknownAction, isKnownAction } from '../actions'
import { ReadOnlyActionTypes } from '../actions/internal/read-only-actions'

export type State = SiteVersion | null

export function getInitialState(siteVersion: SiteVersion | null = null): State {
  return siteVersion
}

export function getSiteVersion(state: State): SiteVersion | null {
  return state
}

export function reducer(state = getInitialState(), action: Action | UnknownAction): State {
  if (!isKnownAction(action)) return state

  switch (action.type) {
    case ReadOnlyActionTypes.SET_SITE_VERSION:
      return action.payload

    default:
      return state
  }
}
