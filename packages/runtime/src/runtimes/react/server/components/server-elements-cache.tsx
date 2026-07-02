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

// Client-side "cache" of server-rendered elements; this is one of the key pieces in our RSC
// implementation, with React doing the majority of the heavy lifting: when `ReactNode`s are
// passed as props across a 'use client' boundary, React's flight serializer automatically
// renders and encodes them in the RSC stream and then reconstructs them on the client. All
// we need to do on the client is to make these React elements available for lookup/
// manipulation when editing in the builder.
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
