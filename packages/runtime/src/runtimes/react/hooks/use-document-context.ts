'use client'

import { createContext, useContext } from 'react'

export const DocumentKeyContext = createContext<string | null>(null)
export const DocumentLocaleContext = createContext<string | null>(null)

export function useDocumentKey(): string | null {
  return useContext(DocumentKeyContext)
}

export function useDocumentLocale(): string | null {
  return useContext(DocumentLocaleContext)
}
