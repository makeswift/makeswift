export function map<T, U>(
  array: readonly [T, T, ...T[]],
  fn: (x: T) => U,
): [U, U, ...U[]]
export function map<T, U>(
  array: readonly [T, ...T[]],
  fn: (x: T) => U,
): [U, ...U[]]
export function map<T, U>(array: readonly T[], fn: (x: T) => U): U[] {
  return array.map(fn)
}

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

export function isNotEmpty<T>(array: readonly T[]): array is [T, ...T[]] {
  return array.length >= 1
}

export function isTwoOrMoreElements<T>(
  array: readonly T[],
): array is [T, T, ...T[]] {
  return array.length >= 2
}

export function arraysAreEqual<T>(a?: T[], b?: T[]): boolean {
  if (a === b) return true

  if (!a || !b || a.length !== b.length) {
    return false
  }

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }

  return true
}

export function objectsAreEqual(a?: object, b?: object): boolean {
  if (a === b) return true
  if (!a || !b) return false

  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) {
    return false
  }

  for (const key of keys) {
    if (
      !b.hasOwnProperty(key) ||
      a[key as keyof typeof a] !== b[key as keyof typeof b]
    )
      return false
  }

  return true
}

export function hasAllKeys<K, V>(map: Map<K, V>, keys: readonly K[]): boolean {
  if (keys.length !== map.size) return false

  for (const key of keys) {
    if (!map.has(key)) return false
  }

  return true
}
