'use client'

import { createContext, ReactNode, useContext } from 'react'

export type RSCNodes = Map<string, JSX.Element>

const RSCNodesContext = createContext<RSCNodes>(new Map())

export const RSCNodesProvider = ({ children, value }: { children: ReactNode; value: RSCNodes }) => {
  return <RSCNodesContext.Provider value={value}>{children}</RSCNodesContext.Provider>
}

export const useRSCNode = (elementKey: string): JSX.Element | undefined => {
  return useContext(RSCNodesContext).get(elementKey)
}
