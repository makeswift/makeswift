'use client'

import { createContext, ReactNode, useContext } from 'react'

type RSCNodes = Record<string, JSX.Element>

const RSCNodesContext = createContext<RSCNodes>({})

export const RSCNodesProvider = ({ children, value }: { children: ReactNode; value: RSCNodes }) => {
  return <RSCNodesContext.Provider value={value}>{children}</RSCNodesContext.Provider>
}

export const useRSCNodes = () => {
  return useContext(RSCNodesContext)
}
