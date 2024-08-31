type Predicate<T, U extends T> = (value: T) => value is U

/**
 * Splits the array into two based on the predicate's result. Returns a tuple of arrays with
 * matching and non-matching elements, maintaining the original order within each group.
 *
 * If the predicate includes a type assertion, the resulting arrays will be typed accordingly.
 */
export function partition<T, U extends T>(
  array: readonly T[],
  predicate: Predicate<T, U>,
): [U[], Exclude<T, U>[]]

export function partition<T>(array: readonly T[], predicate: (value: T) => boolean): [T[], T[]]

export function partition(
  array: readonly unknown[],
  predicate: (value: unknown) => boolean,
): [unknown[], unknown[]] {
  return array.reduce(
    (result: [unknown[], unknown[]], value) => {
      result[predicate(value) ? 0 : 1].push(value)
      return result
    },
    [[], []],
  )
}

type R = Record<string, unknown>

/**
 * Splits the record into two based on the predicate's result. Returns a tuple of records with
 * matching and non-matching elements.
 *
 * If the predicate includes a type assertion, the resulting records will be typed accordingly.
 */
export function partitionRecord<T, U extends T>(
  obj: Record<string, T>,
  predicate: Predicate<T, U>,
): [Record<string, U>, Record<string, Exclude<T, U>>]

export function partitionRecord<T>(
  obj: Record<string, T>,
  predicate: (value: T) => boolean,
): [Record<string, T>, Record<string, T>]

export function partitionRecord(obj: R, predicate: (value: unknown) => boolean): [R, R] {
  return Object.entries(obj).reduce(
    (result, [key, value]) => {
      result[predicate(value) ? 0 : 1][key] = value
      return result
    },
    [{}, {}] as [R, R],
  )
}
