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

export function isNotNil<T>(value: T | null | undefined): value is T {
  return value != null
}

export function isNotEmpty<T>(array: readonly T[]): array is [T, ...T[]] {
  return array.length >= 1
}

export function isTwoOrMoreElements<T>(
  array: readonly T[],
): array is [T, T, ...T[]] {
  return array.length >= 2
}

export function hasAllKeys<K, V>(map: Map<K, V>, keys: readonly K[]): boolean {
  if (keys.length !== map.size) return false

  for (const key of keys) {
    if (!map.has(key)) return false
  }

  return true
}
