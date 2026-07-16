import { type Data } from '../../common/types'

const { hasOwnProperty } = Object.prototype

/**
 * Shallow equality for scalars, arrays and plain objects.
 */
export const shallowEqual = (a: Data, b: Data): boolean => {
  if (Object.is(a, b)) return true

  if (
    typeof a !== 'object' ||
    a === null ||
    typeof b !== 'object' ||
    b === null
  )
    return false

  if (Array.isArray(a) !== Array.isArray(b)) return false

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i += 1) {
    if (
      !hasOwnProperty.call(b, keysA[i]) ||
      // @ts-expect-error: {}[string] is OK.
      !Object.is(a[keysA[i]], b[keysA[i]])
    )
      return false
  }

  return true
}
