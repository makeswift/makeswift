type ErrorWithMessage = {
  message: string
}

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  )
}

export const errorMessage = (error: unknown) =>
  isErrorWithMessage(error) ? error.message : typeof error === 'string' ? error : 'Unknown error'
