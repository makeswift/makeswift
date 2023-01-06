import { Action } from '../actions'

export type State = boolean

export function getInitialState(isPreview = false): State {
  return isPreview
}

export function getIsPreview(state: State): boolean {
  return state
}

export function reducer(state = getInitialState(), action: Action): State {
  switch (action.type) {
    default:
      return state
  }
}
