import { ElementImperativeHandle } from '../../../runtimes/react/element-imperative-handle'
import { type Action, type UnknownAction, isKnownAction } from '../../actions'
import { ReadWriteActionTypes } from '../../actions/internal/read-write-action-types'

export type State = Map<string, Map<string, ElementImperativeHandle>>

export function getElementImperativeHandles(
  state: State,
): Map<string, Map<string, ElementImperativeHandle>> {
  return state
}

function getInitialState(): State {
  return new Map()
}

export function reducer(state: State = getInitialState(), action: Action | UnknownAction): State {
  if (!isKnownAction(action)) return state

  switch (action.type) {
    case ReadWriteActionTypes.REGISTER_COMPONENT_HANDLE:
      return new Map(state).set(
        action.payload.documentKey,
        new Map(new Map(state.get(action.payload.documentKey) ?? [])).set(
          action.payload.elementKey,
          action.payload.componentHandle,
        ),
      )

    case ReadWriteActionTypes.UNREGISTER_COMPONENT_HANDLE: {
      const byElementKey = new Map(state.get(action.payload.documentKey) ?? [])

      const deleted = byElementKey.delete(action.payload.elementKey)

      if (!deleted) return state

      return new Map(state).set(action.payload.documentKey, byElementKey)
    }

    default:
      return state
  }
}
