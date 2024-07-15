import { z, ZodError } from 'zod'
import { isTwoOrMoreElements, map } from './functional'

export function summarizeError(error: ZodError<unknown>): string {
  const { formErrors, fieldErrors } = error.flatten()
  return [
    ...formErrors.slice(0, 1),
    ...Object.entries(fieldErrors).map(
      ([field, error]) => `${field}: ${error}`,
    ),
  ].join('; ')
}

export function unionOfLiterals<T extends string>(constants: readonly [T, ...T[]]) {
  const c: readonly [T, T, ...T[]] = isTwoOrMoreElements(constants) ? constants : [constants[0], constants[0]]
  return z.union(map(c, (x) => z.literal(x)))
}
