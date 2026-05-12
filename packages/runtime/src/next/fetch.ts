import { type HttpFetch } from '../state/makeswift-api-client'

import { MAKESWIFT_CACHE_TAG } from './cache'

export const fetch: HttpFetch = (url, init) =>
  globalThis.fetch(url, { ...init, next: { tags: [MAKESWIFT_CACHE_TAG] } })
