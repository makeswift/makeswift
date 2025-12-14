'use client'

import { createContext, useContext } from 'react'
import { type Store } from '../../../state/react-page'

export const StoreContext = createContext<Store | null>(null)

export function useStore(): Store {
  const store = useContext(StoreContext)
  if (store == null) {
    throw new Error('`useStore` must be used within a `StoreProvider`')
  }

  return store
}
