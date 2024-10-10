import { mapValues } from '@makeswift/controls'

export type SerializedState<T> =
  T extends Map<string, infer U>
    ? Record<string, SerializedState<U>>
    : T extends Set<infer U>
      ? Array<SerializedState<U>>
      : T extends Record<string, infer U>
        ? Record<string, SerializedState<U>>
        : T extends Array<infer U>
          ? Array<SerializedState<U>>
          : T

export function serializeState<T>(state: T): SerializedState<T> {
  if (state instanceof Map) {
    return serializeState(Object.fromEntries(state.entries())) as SerializedState<T>
  }

  if (state instanceof Set) return serializeState([...state.values()]) as SerializedState<T>

  if (Array.isArray(state)) return state.map(serializeState) as SerializedState<T>

  if (state !== null && typeof state === 'object') {
    return mapValues(state, serializeState) as SerializedState<T>
  }

  return state as SerializedState<T>
}
