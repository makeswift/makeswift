'use client'

import { createContext, useContext } from 'react'

import { type AnyControlInstance } from '@makeswift/controls'

type Context = {
  elementKey: string
  instances: Record<string, AnyControlInstance> | null
}

const ControlInstancesContext = createContext<Context | null>(null)

export const ControlInstancesProvider = ControlInstancesContext.Provider

export function useControlInstances(elementKey: string | undefined): Context['instances'] | null {
  const cx = useContext(ControlInstancesContext)
  return cx && cx.elementKey === elementKey ? cx.instances : null
}
