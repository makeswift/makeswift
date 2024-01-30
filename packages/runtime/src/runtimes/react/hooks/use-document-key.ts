'use client'

import { createContext, useContext } from 'react'

export const DocumentContext = createContext<string | null>(null)

export function useDocumentKey(): string | null {
  return useContext(DocumentContext)
}
