'use client'

import { ReactNode, createContext, useContext } from 'react'

const DatoContext = createContext<{ data: unknown } | undefined>(undefined)

export function DatoProvider({ children, value }: { children: ReactNode; value: unknown }) {
  return <DatoContext.Provider value={{ data: value }}>{children}</DatoContext.Provider>
}

export function useDatoData() {
  const context = useContext(DatoContext)

  if (context === undefined) {
    return { error: 'useDatoData must be used within a DatoProvider' }
  }

  if (!context.data) {
    return { error: 'No data found' }
  }

  if (Array.isArray(context.data)) {
    return { data: context.data }
  }

  // Type guard to check if the data has an allBlogposts property
  if (typeof context.data === 'object' && context.data !== null && 'allBlogposts' in context.data) {
    return { data: (context.data as { allBlogposts: unknown[] }).allBlogposts[0] }
  }

  // Type guard to check if the data has a blogpost property
  if (typeof context.data === 'object' && context.data !== null && 'blogpost' in context.data) {
    return { data: (context.data as { blogpost: unknown }).blogpost }
  }

  return { data: context.data }
}
