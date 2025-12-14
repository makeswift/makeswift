import { type Action, type UnknownAction, isKnownAction } from '../actions'
import { HostActionTypes } from '../host-api'

export const BuilderEditMode = {
  BUILD: 'build',
  CONTENT: 'content',
  INTERACT: 'interact',
} as const

export type BuilderEditMode = (typeof BuilderEditMode)[keyof typeof BuilderEditMode]

export type State = BuilderEditMode | null

export function getInitialState(): State {
  return null
}

export function reducer(state: State = getInitialState(), action: Action | UnknownAction): State {
  if (!isKnownAction(action)) return state

  switch (action.type) {
    case HostActionTypes.SET_BUILDER_EDIT_MODE:
      return action.payload.editMode

    default:
      return state
  }
}
