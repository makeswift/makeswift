'use client'

import { ReactNode, useEffect } from 'react'
import { type ElementData } from '@makeswift/controls'
import { useFrameworkContext } from '../../runtimes/react/components/hooks/use-framework-context'
import { useUpdateRSCNode, useRemoveRSCNode } from './rsc-nodes-provider'
import {
  RSC_ELEMENT_ADDED_EVENT,
  RSC_ELEMENT_REMOVED_EVENT,
  type RSCElementAddedDetail,
  type RSCElementRemovedDetail,
} from './refresh-middleware'

type RSCRefreshCoordinatorProps = {
  documentKey: string
  locale: string | null
  children: ReactNode
}

/**
 * Client component that coordinates RSC node updates triggered by the Redux middleware.
 * Handles:
 * - New server elements being added (renders them on the server and adds to RSCNodes)
 * - Server elements being removed (removes from RSCNodes)
 *
 * Should be placed inside RSCNodesProvider and the FrameworkContext provider.
 */
export function RSCRefreshCoordinator({
  documentKey,
  locale,
  children,
}: RSCRefreshCoordinatorProps) {
  const { refreshRSCElement } = useFrameworkContext()
  const updateNode = useUpdateRSCNode()
  const removeNode = useRemoveRSCNode()

  // Handle new RSC elements added via the builder
  useEffect(() => {
    const handleElementAdded = async (event: Event) => {
      const { elementData, documentKey: eventDocumentKey } = (event as CustomEvent<RSCElementAddedDetail>).detail

      // Only handle elements for our document
      if (eventDocumentKey !== documentKey) return
      if (!refreshRSCElement) return

      try {
        console.log('[RSC Coordinator] Rendering new element', elementData.key)
        const node = await refreshRSCElement(elementData as ElementData, {
          key: documentKey,
          locale,
        })
        updateNode(elementData.key, node)
      } catch (error) {
        console.error('[RSC Coordinator] Failed to render new element', elementData.key, error)
      }
    }

    const handleElementRemoved = (event: Event) => {
      const { elementKey } = (event as CustomEvent<RSCElementRemovedDetail>).detail
      console.log('[RSC Coordinator] Removing element', elementKey)
      removeNode(elementKey)
    }

    window.addEventListener(RSC_ELEMENT_ADDED_EVENT, handleElementAdded)
    window.addEventListener(RSC_ELEMENT_REMOVED_EVENT, handleElementRemoved)

    return () => {
      window.removeEventListener(RSC_ELEMENT_ADDED_EVENT, handleElementAdded)
      window.removeEventListener(RSC_ELEMENT_REMOVED_EVENT, handleElementRemoved)
    }
  }, [documentKey, locale, refreshRSCElement, updateNode, removeNode])

  return children
}
