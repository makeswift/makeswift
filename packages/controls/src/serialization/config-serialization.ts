import { match, P } from 'ts-pattern'
import {
  isFunction,
  isSerializedFunction,
  serializeFunction,
  deserializeFunction,
  type AnyFunction,
} from './function-serialization'

import { mapValues } from '../utils/functional'

export function serializeConfig(config: unknown): [unknown, Transferable[]] {
  const transferables: Transferable[] = []

  const serializeFunc = (func: AnyFunction) => {
    const r = serializeFunction(func)
    transferables.push(r)
    return r
  }

  const serialize = (value: unknown): unknown =>
    match(value)
      .with(P.when(isFunction), serializeFunc)
      .with(P.array(), (arr) => arr.map(serialize))
      .with({}, (obj) => mapValues(obj, serialize))
      .otherwise(() => value)

  return [serialize(config), transferables]
}

export function deserializeConfig(config: unknown): unknown {
  const deserialize = (value: unknown): unknown =>
    match(value)
      .with(P.when(isSerializedFunction), deserializeFunction)
      .with(P.array(), (arr) => arr.map(deserialize))
      .with({}, (obj) => mapValues(obj, deserialize))
      .otherwise(() => value)

  return deserialize(config)
}
