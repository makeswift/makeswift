'use client'

import { createContext, useContext } from 'react'
import { ReactRuntime } from '../react-runtime'

export const ReactRuntimeContext = createContext<ReactRuntime | null>(null)

export function useReactRuntime(): ReactRuntime {
  const runtime = useContext(ReactRuntimeContext)
  if (runtime === null) {
    throw new Error('`useReactRuntime` must be used within a `ReactRuntimeProvider`')
  }

  return runtime
}
