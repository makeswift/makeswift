import { match, P } from 'ts-pattern'
import {
  isFunction,
  isSerializedFunction,
  serializeFunction,
  deserializeFunction,
  type AnyFunction,
  type DeserializedFunction,
} from './function-serialization'

import { mapValues } from '../utils/functional'
import { ControlDefinition } from '../control-definition'

export type Deserialized<T> = T extends AnyFunction
  ? DeserializedFunction<T>
  : T extends Record<string, unknown>
    ? { [K in keyof T]: Deserialized<T[K]> }
    : T extends Array<infer U>
      ? Array<Deserialized<U>>
      : T

export function serializeObject(object: unknown): [unknown, Transferable[]] {
  const transferables: Transferable[] = []

  const serializeFunc = (func: AnyFunction) => {
    const r = serializeFunction(func)
    transferables.push(r)
    return r
  }

  function serialize(value: unknown): unknown {
    return (
      match(value)
        .with(P.when(isFunction), serializeFunc)
        .with(P.array(), (arr) => arr.map(serialize))
        // TODO: @arvin Review serialization. Problem context: when serializing
        // a list, the resulting object was missing the type field of the items.
        // In the builder, this would result in empty popups. Ex:
        // [{"config":{"type":{"config":{"defaultValue":"red","labelOrientation":"horizontal"},"version":1},"label":"Color
        // list"},"type":"makeswift::controls::list"},[]]

        // The same is true for serialized functions. Without manually spreading
        // the transferrables of sub-controls, we would get a Uncaught
        // DOMException: Failed to execute 'postMessage' on 'MessagePort': A
        // MessagePort could not be cloned because it was not transferred.
        .with(P.instanceOf(ControlDefinition), (def) => {
          const [defSerialization, defTransferrables] = def.serialize()
          transferables.push(...defTransferrables)
          return defSerialization
        })
        .with({}, (obj) => mapValues(obj, serialize))
        .otherwise(() => value)
    )
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
