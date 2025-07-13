import { DeserializedFunction, SerializedFunction } from '../function-serialization'

type AnyFunction = (...args: any[]) => any

export type Serialize<T> = T extends AnyFunction
  ? SerializedFunction<T>
  : T extends Record<string, unknown>
    ? { [K in keyof T]: Serialize<T[K]> }
    : T

export type Deserialize<T> =
  T extends SerializedFunction<infer U>
    ? DeserializedFunction<U>
    : T extends Record<string, unknown>
      ? { [K in keyof T]: Deserialize<T[K]> }
      : T
