'use client'

import { ReactNode, createContext, useContext } from 'react'

const ContentfulContext = createContext<{ data: unknown } | undefined>(undefined)

export function ContentfulProvider({ children, value }: { children: ReactNode; value: unknown }) {
  return <ContentfulContext.Provider value={{ data: value }}>{children}</ContentfulContext.Provider>
}

export function useContentfulData() {
  const context = useContext(ContentfulContext)

  if (context === undefined) {
    return { error: 'useContentfulData must be used within a ContentfulProvider' }
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
