import { useCallback } from 'react'

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
 * Calls the `onCommitted` callback once after a successfully rendered node is
 * committed to the current React tree.
 */
export const useServerElementRefresh = ({
  elementKey,
}: {
  elementKey: string
}): ((elementData: ElementData, onCommitted?: () => void) => Promise<void>) => {
  const { renderRSCElement } = useFrameworkContext()
  const { beginRefresh } = useServerElementsCache()

  const documentKey = useDocumentKey()
  const documentLocale = useDocumentLocale()
  const apiResourcesClient = useApiResourcesClient()

  return useCallback(
    async (elementData: ElementData, onCommitted?: () => void): Promise<void> => {
      if (!documentKey) return
      if (elementData.key !== elementKey) {
        console.error(
          `Cannot refresh server element: mismatching element key '${elementData.key}' != '${elementKey}'`,
        )
        return
      }

      if (!renderRSCElement) {
        console.error(
          `Cannot refresh server element '${elementKey}' of type '${elementData.type}': \`renderRSCElement\` callback is null`,
        )
        return
      }

      try {
        const commit = beginRefresh(elementKey, onCommitted)
        if (commit == null) return

        const reactNode = await renderRSCElement({
          elementData,
          cacheData: apiResourcesClient.cacheData,
          documentContext: {
            key: documentKey,
            locale: documentLocale ?? undefined,
          },
        })

        commit(reactNode)
      } catch (error) {
        console.error(
          `Failed to refresh server element '${elementKey}' of type '${elementData.type}'`,
          error,
        )
      }
    },
    [renderRSCElement, documentKey, documentLocale, elementKey, apiResourcesClient, beginRefresh],
  )
}
