import { ReactRuntime } from '../runtimes/react/react-runtime'
import { type BreakpointsInput } from '../state/modules/breakpoints'

import { MAKESWIFT_CACHE_TAG } from './cache'

export class NextReactRuntime extends ReactRuntime {
  constructor(
    args: { appOrigin?: string; apiOrigin?: string; breakpoints?: BreakpointsInput } = {},
  ) {
    super({
      ...args,
      fetch: (url, init) => fetch(url, { ...init, next: { tags: [MAKESWIFT_CACHE_TAG] } }),
    })
  }
}
