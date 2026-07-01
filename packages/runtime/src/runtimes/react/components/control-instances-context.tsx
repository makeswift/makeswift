'use client'

import { createContext, useContext } from 'react'

import { ControlInstance } from '@makeswift/controls'

const ControlInstancesContext = createContext<Record<string, ControlInstance> | null>(null)

export const ControlInstancesProvider = ControlInstancesContext.Provider

export function useControlInstances(): Record<string, ControlInstance> | null {
  return useContext(ControlInstancesContext)
}
