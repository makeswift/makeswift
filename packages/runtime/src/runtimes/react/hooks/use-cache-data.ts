import { useMemo } from 'react'
import { type CacheData } from '../../../api/api-resources-client'

import { updateAPIClientCache } from '../../../state/actions/internal/read-write-actions'

import { useApiResourcesClient } from './use-api-resources-client'

export function useCacheData(cacheData: CacheData) {
  const { store: apiStore } = useApiResourcesClient()

  // We perform cache hydration immediately on render - this is safe to do per
  // render because updating the API cache is idempotent. For precedence, see:
  //
  // https://github.com/TanStack/query/blob/8f9f183f11df3709a1a38c4efce1452788041f88/packages/react-query/src/HydrationBoundary.tsx#L41
  useMemo(() => apiStore.dispatch(updateAPIClientCache(cacheData)), [cacheData])
}
