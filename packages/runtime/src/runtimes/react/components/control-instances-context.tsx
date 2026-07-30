'use client'

import { createContext, useContext } from 'react'

import { ControlInstance } from '@makeswift/controls'

type Context = {
  elementKey: string
  instances: Record<string, ControlInstance> | null
}

const ControlInstancesContext = createContext<Context | null>(null)

export const ControlInstancesProvider = ControlInstancesContext.Provider

export function useControlInstances(elementKey: string): Context['instances'] | null {
  const cx = useContext(ControlInstancesContext)
  return cx && cx.elementKey === elementKey ? cx.instances : null
}
