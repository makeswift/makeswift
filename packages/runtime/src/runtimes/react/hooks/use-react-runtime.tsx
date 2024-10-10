'use client'

import { createContext, useContext } from 'react'
import { ReactRuntime } from '../react-runtime'

export const ReactRuntimeContext = createContext<ReactRuntime>(ReactRuntime)

export function useReactRuntime(): ReactRuntime {
  return useContext(ReactRuntimeContext)
}
