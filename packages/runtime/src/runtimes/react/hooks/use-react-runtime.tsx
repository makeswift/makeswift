'use client'

import { createContext, useContext } from 'react'
import { BasicReactRuntime } from '../basic-react-runtime'

export const ReactRuntimeContext = createContext<BasicReactRuntime | null>(null)

export function useReactRuntime(): BasicReactRuntime {
  const runtime = useContext(ReactRuntimeContext)
  if (runtime === null) {
    throw new Error('`useReactRuntime` must be used within a `ReactRuntimeProvider`')
  }

  return runtime
}
