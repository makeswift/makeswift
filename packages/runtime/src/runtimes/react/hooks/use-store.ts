'use client'

import { createContext, useContext } from 'react'
import { RuntimeCore } from '../runtime-core'
import { Store } from '../../../state/react-page'

export const StoreContext = createContext(RuntimeCore.store)

export function useStore(): Store {
  return useContext(StoreContext)
}
