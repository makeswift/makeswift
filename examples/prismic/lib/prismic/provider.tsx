'use client'

import { ReactNode, createContext, useContext } from 'react'

const PrismicContext = createContext<{ data: unknown } | undefined>(undefined)

export function PrismicProvider({ children, value }: { children: ReactNode; value: unknown }) {
  return <PrismicContext.Provider value={{ data: value }}>{children}</PrismicContext.Provider>
}

export function usePrismicData() {
  const context = useContext(PrismicContext)

  if (context === undefined) {
    return { error: 'usePrismicData must be used within a PrismicProvider' }
  }

  if (!context.data) {
    return { error: 'No data found' }
  }

  if (Array.isArray(context.data)) {
    return { data: context.data }
  }

  // Type guard to check if the data has an items property
  if (typeof context.data === 'object' && context.data !== null && 'items' in context.data) {
    return { data: (context.data as { items: unknown[] }).items[0] }
  }

  return { data: context.data }
}
