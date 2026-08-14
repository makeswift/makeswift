import { useCallback, useEffect, useRef } from 'react'

import { type ElementData } from '../../../state/read-only-state'

import { useFrameworkContext } from '../components/hooks/use-framework-context'
import { useServerElementsCache } from '../server/components/server-elements-cache'

import { useDocumentKey, useDocumentLocale } from './use-document-context'
import { useApiResourcesClient } from './use-api-resources-client'

/**
 * Returns a element-scoped callback that renders the provided element data on
 * the server and stores the result in the server element cache under the
 * provided element key.
 *
 * The callback returns true only if the element render succeeds and is committed
 * to the cache. Returns false when rendering is unavailable, fails, or produces a
 * stale/out-of-order result.
 */
export const useServerElementRefresh = ({
  elementKey,
}: {
  elementKey: string
}): ((elementData: ElementData) => Promise<boolean>) => {
  const requestIdRef = useRef(0)
  const lastAppliedRequestId = useRef(0)

  const { renderRSCElement } = useFrameworkContext()
  const { updateElement } = useServerElementsCache()

  const documentKey = useDocumentKey()
  const documentLocale = useDocumentLocale()
  const apiResourcesClient = useApiResourcesClient()

  useEffect(() => {
    // Invalidate all in-flight requests on unmount so they cannot update the cache
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      lastAppliedRequestId.current = ++requestIdRef.current
    }
  }, [])

  return useCallback(
    async (elementData: ElementData): Promise<boolean> => {
      if (!documentKey) return false
      if (elementData.key !== elementKey) {
        console.error(
          `Cannot refresh server element: mismatching element key '${elementData.key}' != '${elementKey}'`,
        )
        return false
      }

      if (!renderRSCElement) {
        console.error(
          `Cannot refresh server element '${elementKey}' of type '${elementData.type}': \`renderRSCElement\` callback is null`,
        )
        return false
      }

      try {
        // Assign each server refresh a sequential ID so we can track response
        // arrival and ignore out-of-order results
        const requestId = ++requestIdRef.current
        const reactNode = await renderRSCElement({
          elementData,
          cacheData: apiResourcesClient.cacheData,
          documentContext: {
            key: documentKey,
            locale: documentLocale ?? undefined,
          },
        })

        if (requestId > lastAppliedRequestId.current) {
          updateElement(elementKey, reactNode)
          lastAppliedRequestId.current = requestId
          return true
        }
      } catch (error) {
        console.error(
          `Failed to refresh server element '${elementKey}' of type '${elementData.type}'`,
          error,
        )
      }

      return false
    },
    [renderRSCElement, documentKey, documentLocale, elementKey, apiResourcesClient, updateElement],
  )
}
