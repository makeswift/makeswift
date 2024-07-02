export function mapValues<T extends object, R>(
  obj: T,
  callback: (t: T[keyof T], key: keyof T) => R,
): { [P in keyof T]: R } {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      callback(value, key as keyof T),
    ]),
  ) as { [P in keyof T]: R }
}

export function notNil<T>(value: T | null | undefined): value is T {
  return value != null
}

export function keyNotNil<T extends object, Key extends keyof T>(
  data: T,
  key: Key,
): data is T & { [K in Key]: Exclude<T[K], null | undefined> } {
  return data[key] != null
}
