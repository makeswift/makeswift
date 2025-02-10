import { useMemo } from 'react'
import { type CacheData } from '../../../api/react'
import { updateAPIClientCache } from '../../../state/actions'

import { useMakeswiftHostApiClient } from '../host-api-client'

export function useCacheData(cacheData: CacheData) {
  const { makeswiftApiClient: apiStore } = useMakeswiftHostApiClient()

  // We perform cache hydration immediately on render - this is safe to do per
  // render because updating the API cache is idempotent. For precedence, see:
  //
  // https://github.com/TanStack/query/blob/8f9f183f11df3709a1a38c4efce1452788041f88/packages/react-query/src/HydrationBoundary.tsx#L41
  useMemo(() => apiStore.dispatch(updateAPIClientCache(cacheData)), [cacheData])
}
