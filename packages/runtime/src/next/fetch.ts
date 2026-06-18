import { type HttpFetch } from '../api/types'

import { MAKESWIFT_CACHE_TAG } from './cache'

export const fetch: HttpFetch = (url, init) =>
  globalThis.fetch(url, { ...init, next: { tags: [MAKESWIFT_CACHE_TAG] } })
