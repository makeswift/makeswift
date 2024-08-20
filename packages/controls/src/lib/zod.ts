import { z, ZodError, type Primitive } from 'zod'

import { isTwoOrMoreElements, map } from './functional'

export type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export function safeParse<Schema extends z.ZodType>(
  schema: Schema,
  data: unknown | undefined,
): ParseResult<z.infer<Schema> | undefined> {
  const result = schema.optional().safeParse(data)
  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: summarizeError(result.error) }
}

export function summarizeError(error: ZodError<unknown>): string {
  const { formErrors, fieldErrors } = error.flatten()
  return [
    ...formErrors.slice(0, 1),
    ...Object.entries(fieldErrors).map(
      ([field, error]) => `${field}: ${error}`,
    ),
  ].join('; ')
}

export function unionOfLiterals<T extends Primitive>(
  constants: readonly [T, ...T[]],
) {
  const c: readonly [T, T, ...T[]] = isTwoOrMoreElements(constants)
    ? constants
    : [constants[0], constants[0]]

  return z.union(map(c, (x) => z.literal(x)))
}
