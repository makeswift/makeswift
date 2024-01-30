'use client'

import { createContext, useContext } from 'react'
import { ReactRuntime } from '../react-runtime'
import { Store } from '../../../state/react-page'

export const StoreContext = createContext(ReactRuntime.store)

export function useStore(): Store {
  return useContext(StoreContext)
}
