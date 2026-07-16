import { type Data } from '../../common/types'

import { shallowEqual } from './shallowEqual'

const { hasOwnProperty } = Object.prototype

/**
 * Deep equality for scalars, arrays and plain objects.
 */
export const deepEqual = (a: Data, b: Data): boolean => {
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

  for (let i = 0; i < keysA.length; i += 1) {
    if (
      !hasOwnProperty.call(b, keysA[i]) ||
      // @ts-expect-error: {}[string] is OK.
      !deepEqual(a[keysA[i]], b[keysA[i]])
    )
      return false
  }

  return true
}
