import { type Action, type UnknownAction, ActionTypes, isKnownAction } from '../actions'

export type State = Set<string>

export function getInitialState(): State {
  return new Set<string>()
}

export function getRSCElementKeys(state: State): Set<string> {
  return state
}

export function hasRSCElementKey(state: State, key: string): boolean {
  return state.has(key)
}

export function reducer(state: State = getInitialState(), action: Action | UnknownAction): State {
  if (!isKnownAction(action)) return state

  switch (action.type) {
    case ActionTypes.SET_RSC_ELEMENT_KEYS: {
      return new Set(action.payload.keys)
    }

    default:
      return state
  }
}
