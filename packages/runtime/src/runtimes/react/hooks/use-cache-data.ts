import { type CacheData } from '../../../api/react'
import { updateAPIClientCache } from '../../../state/actions'

import { useMakeswiftHostApiClient } from '../host-api-client'
import { useUniversalDispatch } from './use-universal-dispatch'

export function useCacheData(cacheData: CacheData) {
  const { makeswiftApiClient: apiStore } = useMakeswiftHostApiClient()
  useUniversalDispatch(apiStore.dispatch, updateAPIClientCache, [cacheData])
}
