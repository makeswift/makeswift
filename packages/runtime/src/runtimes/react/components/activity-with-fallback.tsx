import * as React from 'react'
import { Suspense, type ReactNode } from 'react'

type Props = {
  suspenseFallback?: boolean
  children: ReactNode
}

// Activity is only available in React 19.2+. On Next.js <16, direct access like React['Activity'] or React.Activity
// triggers bundler warnings about missing exports. Using a variable bypasses static analysis.
const ACTIVITY_KEY = 'Activity'
const Activity = React[ACTIVITY_KEY]

export function supportsActivity(): boolean {
  return Activity != null
}

/**
 * Uses React.Activity if available, otherwise falls back to
 * Suspense (when suspenseFallback is true) or Fragment (when false).
 */
export function ActivityOrFallback({ suspenseFallback = true, children }: Props): ReactNode {
  if (supportsActivity()) {
    return <Activity>{children}</Activity>
  }

  return suspenseFallback ? <Suspense>{children}</Suspense> : <>{children}</>
}
