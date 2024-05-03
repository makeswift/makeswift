// See https://github.com/microsoft/TypeScript/issues/15300
export type IndexSignatureHack<T> = T extends Record<string, any>
  ? { [K in keyof T]: IndexSignatureHack<T[K]> }
  : T
