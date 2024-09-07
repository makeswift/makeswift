import { useId } from 'react'

export function useCssId(): string {
  return useId().replaceAll(':', '') // CSS class names prohibit colons
}
