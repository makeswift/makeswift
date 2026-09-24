'use client'

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useIsomorphicLayoutEffect } from '../../../../components/hooks/useIsomorphicLayoutEffect'

import { type ElementsMap } from '../collect-server-elements'

type CommitRefresh = (node: ReactNode) => void

type ElementRequests = {
  lastIssued: number
  lastAccepted: number
  lastCommitted: number
}

type ContextValue = {
  getElement: (elementKey: string) => ReactNode
  beginRefresh: (elementKey: string, onCommitted?: () => void) => CommitRefresh | null
}

type CacheEntry = {
  node: ReactNode
  onCommitted?: () => void
}

type CacheState = {
  initialElements: ElementsMap
  elements: Map<string, CacheEntry>
  refreshScope: {
    active: boolean
    requestsByElement: Map<string, ElementRequests>
  }
}

const createCacheState = (initialElements: ElementsMap): CacheState => ({
  initialElements,
  elements: new Map(Array.from(initialElements, ([key, node]) => [key, { node }] as const)),
  refreshScope: {
    active: false,
    requestsByElement: new Map(),
  },
})

const Context = createContext<ContextValue>({
  getElement: () => null,
  beginRefresh: () => null,
})

/**
 * Client-side "cache" of server-rendered elements; this is one of the key pieces in our RSC
 * implementation, with React doing the majority of the heavy lifting: when `ReactNode`s are
 * passed as props across a 'use client' boundary, React's flight serializer automatically
 * renders and encodes them in the RSC stream and then reconstructs them on the client. All
 * we need to do on the client is to make these React elements available for lookup/
 * manipulation when editing in the builder.
 */
export const ServerElementsCache = ({
  children,
  value,
}: {
  children: ReactNode
  value: ElementsMap
}) => {
  const [state, setState] = useState<CacheState>(() => createCacheState(value))
  // A new elements map resets the state
  if (state.initialElements !== value) {
    setState(createCacheState(value))
  }

  const { elements, refreshScope } = state

  // Run during React commit, before paint
  useIsomorphicLayoutEffect(() => {
    // Activate current scope on mount / whenever we reset the state
    refreshScope.active = true
    return () => {
      // Stop accepting refresh requests associated with the old scope
      refreshScope.active = false
    }
  }, [refreshScope])

  const getElement = useCallback(
    // Always wrap the node in `<RefreshCommitObserver>` so adding a commit callback
    // during refresh doesn't change the tree shape and remount the refreshed node
    (elementKey: string): ReactNode => {
      const entry = elements.get(elementKey)
      if (entry == null) return null

      return (
        <RefreshCommitObserver onCommitted={entry.onCommitted}>{entry.node}</RefreshCommitObserver>
      )
    },
    [elements],
  )

  const beginRefresh = useCallback(
    (elementKey: string, onCommitted?: () => void) => {
      const { requestsByElement } = refreshScope

      const elementRequests = requestsByElement.get(elementKey) ?? {
        lastIssued: 0,
        lastAccepted: 0,
        lastCommitted: 0,
      }

      requestsByElement.set(elementKey, elementRequests)

      const requestId = ++elementRequests.lastIssued

      return (node: ReactNode): void => {
        // Ignore stale updates
        if (!refreshScope.active || requestId <= elementRequests.lastAccepted) return

        elementRequests.lastAccepted = requestId
        const notifyCommitted = () => {
          if (requestId <= elementRequests.lastCommitted) return

          elementRequests.lastCommitted = requestId
          // Don't retain the external callback and its captured values after notification
          const callback = onCommitted
          onCommitted = undefined
          callback?.()
        }

        setState(prev => {
          // Ignore updates that come in between element map replacement and scope deactivation
          if (prev.refreshScope !== refreshScope) return prev

          return {
            ...prev,
            elements: new Map(prev.elements).set(elementKey, {
              node,
              onCommitted: notifyCommitted,
            }),
          }
        })
      }
    },
    [refreshScope],
  )

  const result = useMemo(() => ({ getElement, beginRefresh }), [getElement, beginRefresh])

  return <Context.Provider value={result}>{children}</Context.Provider>
}

const RefreshCommitObserver = ({
  children,
  onCommitted,
}: {
  children: ReactNode
  onCommitted?: () => void
}) => {
  // Notify the caller that the updated element node has been committed to
  // the current React tree
  useEffect(() => onCommitted?.(), [onCommitted])
  return children
}

export const ServerElementsProvider = ({
  children,
  elements,
}: {
  children: ReactNode
  elements: ElementsMap
}) => <ServerElementsCache value={elements}>{children}</ServerElementsCache>

export const useServerElementsCache = () => useContext(Context)
