import { useCallback, useEffect, useRef } from 'react'

import { type ElementData } from '../../../state/read-only-state'

import { useFrameworkContext } from '../components/hooks/use-framework-context'
import { useServerElementsCache } from '../server/components/server-elements-cache'

import { useDocumentKey, useDocumentLocale } from './use-document-context'
import { useApiResourcesClient } from './use-api-resources-client'

export const useServerElementRefresh = ({ elementKey }: { elementKey: string }) => {
  const requestIdRef = useRef(0)

  const { renderRSCElement } = useFrameworkContext()
  const { updateElement } = useServerElementsCache()

  const documentKey = useDocumentKey()
  const documentLocale = useDocumentLocale()
  const apiResourcesClient = useApiResourcesClient()

  useEffect(() => {
    // Increment request ID on umount to prevent potential clobbering of the
    // element cache with stale data
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ++requestIdRef.current
    }
  }, [])

  return useCallback(
    async (elementData: ElementData): Promise<boolean> => {
      if (!documentKey) return false

      if (!renderRSCElement) {
        console.error(
          `Cannot refresh server element '${elementData.type}': \`renderRSCElement\` callback is null`,
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

        if (requestId === requestIdRef.current) {
          updateElement(elementKey, reactNode)
          return true
        }
      } catch (error) {
        console.error(`Failed to refresh server element '${elementData.type}'`, error)
      }

      return false
    },
    [renderRSCElement, documentKey, documentLocale, elementKey, apiResourcesClient, updateElement],
  )
}
