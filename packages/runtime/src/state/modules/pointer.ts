import { Action, ActionTypes } from '../actions'

export type Point = { x: number; y: number }

type State = {
  pointer: Point | null
}

function getInitialState(): State {
  return { pointer: null }
}

export function getPointer(state: State): Point | null {
  return state.pointer
}

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    case ActionTypes.BUILDER_POINTER_MOVE:
      return { ...state, pointer: action.payload.pointer }

    default:
      return state
  }
}
