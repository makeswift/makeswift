import deepEqual from './deepEqual'
import keys from './keys'

export default function intersection<A extends Record<string, unknown>, B extends A>(
  a: A,
  b: B,
  isEqual: (a: unknown, b: unknown) => boolean = deepEqual,
): { [K in keyof A]: A[K] | null } {
  const allKeys = [...new Set([...keys(a), ...keys(b)])] as (keyof A)[]

  return allKeys.reduce(
    (acc, k) => {
      if (isEqual(a[k], b[k])) acc[k] = a[k]
      else acc[k] = null

      return acc
    },
    {} as { [K in keyof A]: A[K] | null },
  )
}
