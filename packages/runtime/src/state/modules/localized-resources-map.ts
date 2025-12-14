import { mapValues } from '@makeswift/controls'
import { type Action, type UnknownAction, isKnownAction } from '../actions'
import { ReadWriteActionTypes } from '../actions/internal/read-write-actions'
import { HostActionTypes } from '../host-api'

type State = Map<string, Map<string, string | null>>

export type SerializedState = {
  [locale: string]: {
    [resourceId: string]: string | null
  }
}

export function getInitialState(serializedState: SerializedState = {}): State {
  return new Map(
    Object.entries(mapValues(serializedState, resources => new Map(Object.entries(resources)))),
  )
}

export function getSerializedState(state: State): SerializedState {
  return mapValues(Object.fromEntries(state.entries()), resources =>
    Object.fromEntries(resources.entries()),
  )
}

export function getLocalizedResourceId(
  state: State,
  locale: string,
  resourceId: string,
): string | undefined | null {
  return state.get(locale)?.get(resourceId)
}

export function reducer(state: State = getInitialState(), action: Action | UnknownAction): State {
  if (!isKnownAction(action)) return state

  switch (action.type) {
    case HostActionTypes.SET_LOCALIZED_RESOURCE_ID: {
      const { resourceId, localizedResourceId, locale } = action.payload

      if (locale == null) {
        console.error('Attempt to set a localized resource ID for a non-localized page', {
          resourceId,
          localizedResourceId,
        })

        return state
      }

      return new Map(state).set(
        locale,
        (state.get(locale) ?? new Map()).set(resourceId, localizedResourceId),
      )
    }

    case ReadWriteActionTypes.UPDATE_API_CLIENT_CACHE: {
      const { localizedResourcesMap } = action.payload

      return Object.entries(localizedResourcesMap).reduce((state, [locale, resources]) => {
        const existing = state.get(locale) ?? new Map<string, string | null>()
        const updated = Object.entries(resources).reduce((r, [id, localizedId]) => {
          return r.get(id) != null ? r : new Map(r).set(id, localizedId)
        }, existing)

        return updated === existing ? state : new Map(state).set(locale, updated)
      }, state)
    }

    default:
      return state
  }
}
