export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value
}

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

export function is(x: unknown, y: unknown): boolean {
  if (x === y) return x !== 0 || y !== 0 || 1 / x === 1 / y
  return x !== x && y !== y
}

export function shallowEqual(a: unknown, b: unknown) {
  if (is(a, b)) return true

  if (
    typeof a !== 'object' ||
    a === null ||
    typeof b !== 'object' ||
    b === null
  )
    return false

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false
  if (
    keysA.some(
      (key) =>
        !Object.prototype.hasOwnProperty.call(b, key) ||
        !is(a[key as keyof typeof a], b[key as keyof typeof b]),
    )
  )
    return false

  return true
}
export function deepEqual(a: unknown, b: unknown) {
  if (shallowEqual(a, b)) return true

  if (
    typeof a !== 'object' ||
    a === null ||
    typeof b !== 'object' ||
    b === null
  )
    return false

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false

  if (
    keysA.some(
      (key) =>
        !Object.prototype.hasOwnProperty.call(b, key) ||
        !deepEqual(a[key as keyof typeof a], b[key as keyof typeof b]),
    )
  )
    return false

  return true
}
