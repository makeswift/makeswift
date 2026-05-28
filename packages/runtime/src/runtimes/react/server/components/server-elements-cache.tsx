'use client'

import { createContext, ReactNode, startTransition, useCallback, useContext, useState } from 'react'

import { type ElementsMap } from '../collect-server-elements'

type ContextValue = {
  getElement: (elementKey: string) => ReactNode
  updateElement: (elementKey: string, node: ReactNode) => void
  removeElement: (elementKey: string) => void
}

const Context = createContext<ContextValue>({
  getElement: () => null,
  updateElement: () => {},
  removeElement: () => {},
})

// This is one of the key pieces that makes our RSC implementation work: when `ReactNode`s are passed
// as props across a 'use client' boundary, React's flight serializer encodes them in the RSC stream
// and reconstructs them on the client. By receiving the server-rendered elements as the `value` prop
// and storing them in `useState`, we enable client-side access to fully rendered RSC subtrees without
// re-fetching or re-executing any server code.
export const ServerElementsCache = ({
  children,
  value,
}: {
  children: ReactNode
  value: ElementsMap
}) => {
  const [nodes, setNodes] = useState(value)

  const getElement = useCallback((elementKey: string): ReactNode => nodes.get(elementKey), [nodes])

  const updateElement = useCallback(
    (elementKey: string, node: ReactNode) =>
      startTransition(() => setNodes(prev => new Map(prev).set(elementKey, node))),
    [],
  )

  const removeElement = useCallback(
    (elementKey: string) =>
      startTransition(() =>
        setNodes(prev => {
          const next = new Map(prev)
          next.delete(elementKey)
          return next
        }),
      ),
    [],
  )

  return (
    <Context.Provider value={{ getElement, updateElement, removeElement }}>
      {children}
    </Context.Provider>
  )
}

export const useServerElementsCache = () => useContext(Context)
