import { type ControlInstanceKey } from '@makeswift/controls'

import { type Action, type UnknownAction, isKnownAction } from '../../actions'
import { ReadWriteActionTypes } from '../../actions/internal/read-write-action-types'

import { Branded } from '../../../utils/branded'

export type ResolvedValueKey = ControlInstanceKey
export type ResolvedValue = unknown
export type ResolvedValueOverrides = {
  instanceKey: ResolvedValueKey
  expectedValue: ResolvedValue
}[]

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

export function getValueOverrides(
  state: State,
  documentKey: string,
  instanceKeys: ResolvedValueKey[],
): ResolvedValueOverrides {
  return instanceKeys
    .filter(key => hasValueOverride(state, documentKey, key))
    .map(key => ({
      instanceKey: key,
      expectedValue: getValueOverride(state, documentKey, key),
    }))
}

export function reducer(state: State = getInitialState(), action: Action | UnknownAction) {
  if (!isKnownAction(action)) return state

  switch (action.type) {
    case ReadWriteActionTypes.SET_RESOLVED_VALUE_OVERRIDE: {
      const { documentKey, instanceKey, value } = action.payload
      return {
        ...state,
        overrides: new Map(state.overrides).set(
          documentKey,
          new Map(state.overrides.get(documentKey) ?? []).set(compositeKey(instanceKey), value),
        ),
      }
    }

    case ReadWriteActionTypes.CLEAR_RESOLVED_VALUE_OVERRIDE: {
      const { documentKey, instanceKey, expectedValue } = action.payload
      const overrides = state.overrides.get(documentKey)
      const key = compositeKey(instanceKey)

      // don't clear if override has been re-set to a different value
      if (!Object.is(overrides?.get(key), expectedValue)) return state

      const nextOverrides = new Map(overrides ?? [])

      const deleted = nextOverrides.delete(key)
      return deleted
        ? { ...state, overrides: new Map(state.overrides).set(documentKey, nextOverrides) }
        : state
    }

    default:
      return state
  }
}
