import { type Action, type UnknownAction, isKnownAction } from '../../actions'
import { HostActionTypes } from '../../host-api'

export type Point = { x: number; y: number }

export type State = {
  pointer: Point | null
}

function getInitialState(): State {
  return { pointer: null }
}

export function getPointer(state: State): Point | null {
  return state.pointer
}

export function reducer(state: State = getInitialState(), action: Action | UnknownAction): State {
  if (!isKnownAction(action)) return state

  switch (action.type) {
    case HostActionTypes.BUILDER_POINTER_MOVE:
      return { ...state, pointer: action.payload.pointer }

    default:
      return state
  }
}
