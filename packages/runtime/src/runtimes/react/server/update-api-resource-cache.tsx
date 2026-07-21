import { type CacheData } from '../../../api/api-resources-client'

import { updateAPIClientCache } from '../../../state/actions/internal/read-write-actions'

import { type Store } from '../../../state/store'

export function updateApiResourceCache(store: Store, cacheData: CacheData) {
  store.apiResourcesClient.store.dispatch(updateAPIClientCache(cacheData))
}
