import { Action, ActionTypes } from '../actions'

export const BuilderEditMode = {
  BUILD: 'build',
  CONTENT: 'content',
  INTERACT: 'interact',
} as const

export type BuilderEditMode = typeof BuilderEditMode[keyof typeof BuilderEditMode]

export type State = BuilderEditMode | null

export function getInitialState(): State {
  return null
}

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    case ActionTypes.SET_BUILDER_EDIT_MODE:
      return action.payload.editMode

    default:
      return state
  }
}
