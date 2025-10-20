import { ReactNode, Activity, Suspense, PropsWithChildren } from 'react'

// Global type extension for React 19.2 Activity API
// This allows us to use Activity when available, even with React 18 types

declare global {
  namespace React {
    const Activity: React.ComponentType<{ children?: ReactNode }> | undefined
  }
}

export function ActivityOrSuspense(props: PropsWithChildren): ReactNode {
  if (Activity) return <Activity {...props} />

  return <Suspense {...props} />
}
