import { useEffect } from 'react'
import { useMakeswiftHostApiClient } from '../../runtimes/react/host-api-client'
import { updateAPIClientCache } from '../../state/actions'
import { CacheData } from '../../api/react'

const isServer = typeof window === 'undefined'

export function useSyncCacheData(cacheData: CacheData) {
  const client = useMakeswiftHostApiClient()

  if (isServer) {
    client.makeswiftApiClient.dispatch(updateAPIClientCache(cacheData))
  }

  useEffect(() => {
    client.makeswiftApiClient.dispatch(updateAPIClientCache(cacheData))
  }, [cacheData, client])
}
