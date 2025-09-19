'use client'

import { createContext, useContext } from 'react'
import { ReactRuntimeCore } from '../react-runtime-core'

export const ReactRuntimeContext = createContext<ReactRuntimeCore | null>(null)

export function useReactRuntime(): ReactRuntimeCore {
  const runtime = useContext(ReactRuntimeContext)
  if (runtime === null) {
    throw new Error('`useReactRuntime` must be used within a `ReactRuntimeProvider`')
  }

  return runtime
}
