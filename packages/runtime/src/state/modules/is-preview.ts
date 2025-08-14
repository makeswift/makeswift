import { type Action, type UnknownAction, isKnownAction } from '../actions'

export type State = boolean

export function getInitialState(isPreview = false): State {
  return isPreview
}

export function getIsPreview(state: State): boolean {
  return state
}

export function reducer(state = getInitialState(), action: Action | UnknownAction): State {
  if (!isKnownAction(action)) return state

  switch (action.type) {
    default:
      return state
  }
}
