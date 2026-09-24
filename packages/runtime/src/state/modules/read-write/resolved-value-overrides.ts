import { type ControlInstanceKey } from '@makeswift/controls'

import { type Action, type UnknownAction, isKnownAction } from '../../actions'
import { ReadWriteActionTypes } from '../../actions/internal/read-write-action-types'

export type ResolvedValueKey = ControlInstanceKey
export type ResolvedValue = unknown

type Override = {
  value: ResolvedValue
  setAtGeneration: number
}

type PropOverrides = Map<string, Override>
type ElementOverrides = Map<string, PropOverrides>

export type State = {
  overrides: Map<string, ElementOverrides>
  // incremented every time an override is set
  generation: number
}

export function getInitialState(): State {
  return { overrides: new Map(), generation: 0 }
}

const getOverride = (
  state: State,
  documentKey: string,
  { elementKey, propPath }: ResolvedValueKey,
): Override | undefined => state.overrides.get(documentKey)?.get(elementKey)?.get(propPath)

export function hasValueOverride(
  state: State,
  documentKey: string,
  instanceKey: ResolvedValueKey,
): boolean {
  return getOverride(state, documentKey, instanceKey) != null
}

export function getValueOverride(
  state: State,
  documentKey: string,
  instanceKey: ResolvedValueKey,
): ResolvedValue {
  return getOverride(state, documentKey, instanceKey)?.value
}

export function getGeneration(state: State): number {
  return state.generation
}

export function reducer(state: State = getInitialState(), action: Action | UnknownAction) {
  if (!isKnownAction(action)) return state

  switch (action.type) {
    case ReadWriteActionTypes.SET_RESOLVED_VALUE_OVERRIDE: {
      const { documentKey, instanceKey, value } = action.payload
      const { elementKey, propPath } = instanceKey
      const generation = state.generation + 1

      const propOverrides = new Map(getPropOverrides(state, documentKey, elementKey)).set(
        propPath,
        { value, setAtGeneration: generation },
      )

      return {
        generation,
        overrides: setPropOverrides(state, documentKey, elementKey, propOverrides),
      }
    }

    case ReadWriteActionTypes.CLEAR_STALE_RESOLVED_VALUE_OVERRIDES: {
      const { documentKey, elementKey, generation } = action.payload
      const propOverrides = getPropOverrides(state, documentKey, elementKey)

      const overridesSinceGeneration = new Map(
        Array.from(propOverrides).filter(([, override]) => override.setAtGeneration > generation),
      )

      return overridesSinceGeneration.size === propOverrides.size
        ? state
        : {
            ...state,
            overrides: setPropOverrides(state, documentKey, elementKey, overridesSinceGeneration),
          }
    }

    default:
      return state
  }
}

const getPropOverrides = (state: State, documentKey: string, elementKey: string): PropOverrides =>
  state.overrides.get(documentKey)?.get(elementKey) ?? new Map()

const setPropOverrides = (
  state: State,
  documentKey: string,
  elementKey: string,
  propOverrides: PropOverrides,
): State['overrides'] =>
  new Map(state.overrides).set(
    documentKey,
    new Map(state.overrides.get(documentKey) ?? []).set(elementKey, propOverrides),
  )
