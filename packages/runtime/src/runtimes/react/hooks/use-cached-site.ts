import { useSyncExternalStore } from 'react'

import { type Site } from '../../../api'
import { useApiResourcesClient } from './use-api-resources-client'

export function useCachedSite(siteId: string | null): Site | null {
  const client = useApiResourcesClient()
  const getSnapshot = () => (siteId == null ? null : client.readSite(siteId))

  return useSyncExternalStore(client.subscribe, getSnapshot, getSnapshot)
}
