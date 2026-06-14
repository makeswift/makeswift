import { useMemo } from 'react'
import { type ResourceResolver } from '@makeswift/controls'

import { createResourceResolver } from '../resource-resolver'

import { useApiResourcesClient } from './use-api-resources-client'
import { useDocumentKey, useDocumentLocale } from './use-document-context'
import { useStore } from './use-store'

export function useResourceResolver(): ResourceResolver {
  const store = useStore()
  const apiClient = useApiResourcesClient()

  const documentKey = useDocumentKey()
  const locale = useDocumentLocale()

  return useMemo<ResourceResolver>(
    () =>
      createResourceResolver({
        store,
        apiClient,
        documentKey,
        locale,
      }),
    [store, apiClient, documentKey, locale],
  )
}
