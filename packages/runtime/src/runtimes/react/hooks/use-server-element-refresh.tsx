import { useCallback } from 'react'

import { type ElementData } from '../../../state/read-only-state'

import { useFrameworkContext } from '../components/hooks/use-framework-context'
import { useServerElementsCache } from '../server/components/server-elements-cache'

import { useDocumentKey, useDocumentLocale } from './use-document-context'

export const useServerElementRefresh = ({ elementKey }: { elementKey: string }) => {
  const { renderRSCElement } = useFrameworkContext()
  const { updateElement } = useServerElementsCache()

  const documentKey = useDocumentKey()
  const documentLocale = useDocumentLocale()

  return useCallback(
    async (elementData: ElementData) => {
      if (!documentKey) return

      if (!renderRSCElement) {
        console.error(
          `Cannot refresh server element '${elementData.type}': \`renderRSCElement\` callback is null`,
        )
        return
      }

      try {
        const reactNode = await renderRSCElement(elementData, {
          key: documentKey,
          locale: documentLocale,
        })

        updateElement(elementKey, reactNode)
      } catch (error) {
        console.error(`Failed to refresh server element '${elementData.type}'`, error)
      }
    },
    [renderRSCElement, documentKey, documentLocale, elementKey, updateElement],
  )
}
