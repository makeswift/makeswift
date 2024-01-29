import { createContext, useContext } from 'react'

export const DocumentCyclesContext = createContext<string[]>([])

export function useDocumentCycles() {
  return useContext(DocumentCyclesContext)
}
