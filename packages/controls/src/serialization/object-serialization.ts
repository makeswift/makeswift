import { match, P } from 'ts-pattern'

import { mapValues } from '../lib/functional'

import { type AnyFunction, type DeserializedFunction } from './function'

export type Deserialized<T> = T extends AnyFunction
  ? DeserializedFunction<T>
  : T extends Record<string, unknown>
    ? { [K in keyof T]: Deserialized<T[K]> }
    : T extends Array<infer U>
      ? Array<Deserialized<U>>
      : T
export interface SerializationPlugin<R = unknown> {
  match: (value: unknown) => boolean
  serialize: (value: R) => unknown
}

export interface DeserializationPlugin<V = unknown, R = unknown> {
  match: (value: unknown) => boolean
  deserialize: (value: V) => R
}

export function serializeObject(
  object: unknown,
  plugins: SerializationPlugin<any>[] = [],
): unknown {
  function serialize(value: unknown): unknown {
    for (const plugin of plugins) {
      if (plugin.match(value)) {
        return plugin.serialize(value)
      }
    }

    return match(value)
      .with(P.array(), (arr) => arr.map(serialize))
      .with({}, (obj) => mapValues(obj, (obj) => serialize(obj) as any))
      .otherwise(() => value)
  }
  return serialize(object)
}

export function deserializeObject(
  object: unknown,
  plugins: DeserializationPlugin<any>[] = [],
): unknown {
  function deserialize(value: unknown): unknown {
    for (const plugin of plugins) {
      if (plugin.match(value)) {
        return plugin.deserialize(value)
      }
    }

    return match(value)
      .with(P.array(), (arr) => arr.map(deserialize))
      .with({}, (obj) => mapValues(obj, (obj) => deserialize(obj) as any))
      .otherwise(() => value)
  }

  return deserialize(object)
}
