import { type Resolvable } from '@makeswift/controls'

export function propErrorHandlingProxy<T>(
  resolvable: Resolvable<T>,
  fallback: T,
  onError?: (error: unknown) => void,
): Resolvable<T> {
  return {
    ...resolvable,
    readStable: () => {
      try {
        return resolvable.readStable()
      } catch (err: unknown) {
        onError?.(err)
        return fallback
      }
    },
  }
}
