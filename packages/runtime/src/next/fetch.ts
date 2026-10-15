import { type HttpFetch } from '../api/types'

import { MAKESWIFT_CACHE_TAG } from './cache'

export const fetch: HttpFetch = (url, init) => {
  const nextInit = init?.next ?? {}

  return globalThis.fetch(url, {
    ...init,
    next: {
      ...nextInit,
      tags: [...(nextInit.tags ?? []), MAKESWIFT_CACHE_TAG],
    },
  })
}
