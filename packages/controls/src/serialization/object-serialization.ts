import { match, P } from 'ts-pattern'

import { mapValues } from '../lib/functional'

import {
  deserializeFunction,
  isFunction,
  isSerializedFunction,
  serializeFunction,
  type AnyFunction,
  type DeserializedFunction,
} from './function-serialization'
import { type SerializedRecord } from './types'

export type Deserialized<T> = T extends AnyFunction
  ? DeserializedFunction<T>
  : T extends Record<string, unknown>
    ? { [K in keyof T]: Deserialized<T[K]> }
    : T extends Array<infer U>
      ? Array<Deserialized<U>>
      : T

export abstract class Serializable {
  abstract serialize(): [SerializedRecord, Transferable[]]
}

export function serializeObject(object: unknown): [unknown, Transferable[]] {
  const transferables: Transferable[] = []

  const serializeFunc = (func: AnyFunction) => {
    const r = serializeFunction(func)
    transferables.push(r)
    return r
  }

  const serializeSerializable = (obj: Serializable) => {
    const [serialized, transferrables_] = obj.serialize()
    transferables.push(...transferrables_)
    return serialized
  }

  function serialize(value: unknown): unknown {
    return match(value)
      .with(P.when(isFunction), serializeFunc)
      .with(P.instanceOf(Serializable), serializeSerializable)
      .with(P.array(), (arr) => arr.map(serialize))
      .with({}, (obj) => mapValues(obj, serialize))
      .otherwise(() => value)
  }
  return [serialize(object), transferables]
}

export function deserializeObject(object: unknown): unknown {
  const deserialize = (value: unknown): unknown =>
    match(value)
      .with(P.when(isSerializedFunction), deserializeFunction)
      .with(P.array(), (arr) => arr.map(deserialize))
      .with({}, (obj) => mapValues(obj, deserialize))
      .otherwise(() => value)

  return deserialize(object)
}
