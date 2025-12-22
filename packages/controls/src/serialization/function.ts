export type AnyFunction = (...args: any) => any

export function isFunction(value: any): value is AnyFunction {
  return typeof value === 'function'
}

export type SerializedFunctionReturnType<T extends AnyFunction> = Awaited<
  ReturnType<T>
>

export type DeserializedFunction<T extends AnyFunction> = (
  ...args: Parameters<T>
) => Promise<SerializedFunctionReturnType<T>>
