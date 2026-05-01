'use client'

import { createContext, ReactNode, startTransition, useCallback, useContext, useState } from 'react'

export type RSCNodes = Map<string, ReactNode>

type RSCNodesContextValue = {
  nodes: RSCNodes
  updateNode: (elementKey: string, node: ReactNode) => void
  removeNode: (elementKey: string) => void
}

const RSCNodesContext = createContext<RSCNodesContextValue>({
  nodes: new Map(),
  updateNode: () => {},
  removeNode: () => {},
})

export const RSCNodesProvider = ({ children, value }: { children: ReactNode; value: RSCNodes }) => {
  const [nodes, setNodes] = useState(value)

  const updateNode = useCallback((elementKey: string, node: ReactNode) => {
    startTransition(() => {
      setNodes(prev => new Map(prev).set(elementKey, node))
    })
  }, [])

  const removeNode = useCallback((elementKey: string) => {
    startTransition(() => {
      setNodes(prev => {
        const next = new Map(prev)
        next.delete(elementKey)
        return next
      })
    })
  }, [])

  return (
    <RSCNodesContext.Provider value={{ nodes, updateNode, removeNode }}>
      {children}
    </RSCNodesContext.Provider>
  )
}

export const useRSCNode = (elementKey: string): ReactNode | undefined => {
  return useContext(RSCNodesContext).nodes.get(elementKey)
}

export const useUpdateRSCNode = () => {
  return useContext(RSCNodesContext).updateNode
}

export const useRemoveRSCNode = () => {
  return useContext(RSCNodesContext).removeNode
}
