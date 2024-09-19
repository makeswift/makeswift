'use client'

import { createContext, useContext } from 'react'

type ContextValue = {
  key: string | null
  locale: string | null
}

export const DocumentContext = createContext<ContextValue>({
  key: null,
  locale: null,
})

export function useDocumentContext(): ContextValue {
  return useContext(DocumentContext)
}

export function useDocumentKey(): string | null {
  return useDocumentContext().key
}

export function useDocumentLocale(): string | null {
  return useDocumentContext().locale
}
