import * as React from 'react'
import type { ReactNode } from 'react'

// Global type extension for React 19.2 Activity API
// This allows us to use Activity when available, even with React 18 types
declare global {
  namespace React {
    const Activity: React.ElementType<{ children?: ReactNode }> | undefined
  }
}

type Props = {
  fallback: React.ElementType<{ children: ReactNode }>
  children: ReactNode
}

/**
 * Activity is only available in React 19.2+.
 * This component checks for React.Activity and uses it if available,
 * otherwise falls back to a provided component (e.g., Suspense or Fragment).
 */
export function ActivityWithFallback({ fallback: Fallback, children }: Props): ReactNode {
  if (React.Activity) {
    return <React.Activity>{children}</React.Activity>
  }

  return <Fallback>{children}</Fallback>
}
