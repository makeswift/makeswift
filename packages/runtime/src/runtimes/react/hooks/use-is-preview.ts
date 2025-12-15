import { useIsReadOnly } from './use-is-read-only'

/**
 * @deprecated Use `useIsReadOnly` instead.
 */
export function useIsPreview(): boolean {
  return !useIsReadOnly()
}
