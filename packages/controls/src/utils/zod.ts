import { ZodError } from 'zod'

export function summarizeError(error: ZodError<unknown>): string {
  const { formErrors, fieldErrors } = error.flatten()
  return [
    ...formErrors.slice(0, 1),
    ...Object.entries(fieldErrors).map(
      ([field, error]) => `${field}: ${error}`,
    ),
  ].join('; ')
}
