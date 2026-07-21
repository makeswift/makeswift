import { type ControlInstanceKey } from '@makeswift/controls'

import { type Action, type UnknownAction, isKnownAction } from '../../actions'
import { ReadWriteActionTypes } from '../../actions/internal/read-write-actions'

import { Branded } from '../../../utils/branded'

export type ResolvedValueKey = ControlInstanceKey
export type ResolvedValue = unknown

type CompositeKey = Branded<string, 'CompositeResolvedValueKey'>

export type State = {
  overrides: Map<string, Map<CompositeKey, ResolvedValue>>
}

export function getInitialState(): State {
  return { overrides: new Map() }
}

const compositeKey = ({ elementKey, propPath }: ResolvedValueKey): CompositeKey =>
  `${elementKey}@${propPath}` as CompositeKey

export function hasValueOverride(
  state: State,
  documentKey: string,
  instanceKey: ResolvedValueKey,
): boolean {
  return state.overrides.get(documentKey)?.has(compositeKey(instanceKey)) ?? false
}

export function getValueOverride(
  state: State,
  documentKey: string,
  instanceKey: ResolvedValueKey,
): ResolvedValue {
  return state.overrides.get(documentKey)?.get(compositeKey(instanceKey))
}

export function reducer(state: State = getInitialState(), action: Action | UnknownAction) {
  if (!isKnownAction(action)) return state

  switch (action.type) {
    case ReadWriteActionTypes.SET_RESOLVED_VALUE_OVERRIDE: {
      const { documentKey, instanceKey, value } = action.payload
      // console.log(`@@ SET_RESOLVED_VALUE_OVERRIDE ${instanceKey.propPath}`, value)
      return {
        ...state,
        overrides: new Map(state.overrides).set(
          documentKey,
          new Map(state.overrides.get(documentKey) ?? []).set(compositeKey(instanceKey), value),
        ),
      }
    }

    case ReadWriteActionTypes.CLEAR_RESOLVED_VALUE_OVERRIDE: {
      const { documentKey, instanceKey } = action.payload
      const nextOverrides = new Map(state.overrides.get(documentKey) ?? [])

      const deleted = nextOverrides.delete(compositeKey(instanceKey))

      return deleted
        ? { ...state, overrides: new Map(state.overrides).set(documentKey, nextOverrides) }
        : state
    }

    default:
      return state
  }
}
