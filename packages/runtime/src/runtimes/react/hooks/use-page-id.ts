'use client'

import { createContext, useContext } from 'react'

export const PageContext = createContext<string | null>(null)

function usePageIdOrNull(): string | null {
  return useContext(PageContext)
}

export function usePageId(): string {
  const pageIdOrNull = usePageIdOrNull()

  if (pageIdOrNull == null) throw new Error('`usePageId` must be used with `<PageProvider>`')

  return pageIdOrNull
}
