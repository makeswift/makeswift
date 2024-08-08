// See https://github.com/microsoft/TypeScript/issues/15300
export type AddIndexSignature<T> =
  T extends Record<string, any>
    ? { [K in keyof T]: AddIndexSignature<T[K]> }
    : T
