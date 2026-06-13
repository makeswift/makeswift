import { useMemo } from 'react'
import { type ResourceResolver } from '@makeswift/controls'

import { useMakeswiftHostApiClient } from '../host-api-client'
import { createResourceResolver } from '../resource-resolver'

import { useStore } from './use-store'
import { useDocumentKey, useDocumentLocale } from './use-document-context'

export function useResourceResolver(): ResourceResolver {
  const store = useStore()
  const apiClient = useMakeswiftHostApiClient()

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
