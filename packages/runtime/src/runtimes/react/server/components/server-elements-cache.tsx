'use client'

import { createContext, ReactNode, useCallback, useContext, useState, useMemo } from 'react'

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
  // An RSC re-render does not inherently remount client components; React can reconcile
  // the new server tree with the existing client tree, so we need to handle the `value`
  // prop updates
  const [nodes, setNodes] = useState(value)
  const [previousValue, setPreviousValue] = useState(value)

  // this is okay to do on render, see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (value !== previousValue) {
    setPreviousValue(value)
    setNodes(value)
  }

  const getElement = useCallback((elementKey: string): ReactNode => nodes.get(elementKey), [nodes])

  const updateElement = useCallback(
    (elementKey: string, node: ReactNode) => setNodes(prev => new Map(prev).set(elementKey, node)),
    [],
  )

  const removeElement = useCallback(
    (elementKey: string) =>
      setNodes(prev => {
        const next = new Map(prev)
        next.delete(elementKey)
        return next
      }),
    [],
  )

  const cache = useMemo(
    () => ({ getElement, updateElement, removeElement }),
    [getElement, updateElement, removeElement],
  )

  return <Context.Provider value={cache}>{children}</Context.Provider>
}

export const useServerElementsCache = () => useContext(Context)
