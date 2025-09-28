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

// https://github.com/facebook/react/blob/f739642745577a8e4dcb9753836ac3589b9c590a/packages/react-server-dom-webpack/src/ReactFlightWebpackReferences.js#L26-L35
const SERVER_REFERENCE_TAG = Symbol.for('react.server.reference')
function isServerReference(reference: unknown): boolean {
  return (
    typeof reference === 'function' &&
    '$$typeof' in reference &&
    reference.$$typeof === SERVER_REFERENCE_TAG
  )
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
      // This serializer is reused in two flows:
      //   • server components → client components (RSC/Flight)
      //   • host → builder
      // In the RSC flow, Flight/Next handles encoding/decoding server references across the boundary.
      // In non-RSC flows (host → builder) server references shouldn’t appear.
      .with(P.when(isServerReference), () => value)
      .with(P.when(isFunction), serializeFunc)
      .with(P.instanceOf(Serializable), serializeSerializable)
      .with(P.array(), (arr) => arr.map(serialize))
      .with({}, (obj) => mapValues(obj, (obj) => serialize(obj) as any))
      .otherwise(() => value)
  }
  return [serialize(object), transferables]
}

export function deserializeObject(object: unknown): unknown {
  const deserialize = (value: unknown): unknown =>
    match(value)
      .with(P.when(isSerializedFunction), deserializeFunction)
      .with(P.array(), (arr) => arr.map(deserialize))
      .with({}, (obj) => mapValues(obj, (obj) => deserialize(obj) as any))
      .otherwise(() => value)

  return deserialize(object)
}
