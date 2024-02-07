'use client'

import { ReactNode, createContext, useContext } from 'react'
import { ReactRuntime } from '../../react'

const Context = createContext<ReactRuntime>(ReactRuntime)

export function useReactRuntime(): ReactRuntime {
  return useContext(Context)
}

export function ReactRuntimeProvider({
  children,
  runtime,
}: {
  children: ReactNode
  runtime: ReactRuntime
}) {
  return <Context.Provider value={runtime}>{children}</Context.Provider>
}
