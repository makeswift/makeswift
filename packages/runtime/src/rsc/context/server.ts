import 'server-only'

import { cache } from 'react'
import { ReactRuntime } from '../../runtimes/react/react-runtime'

const getRuntimeCache = cache((): { runtime: ReactRuntime | null } => ({ runtime: null }))

export function setRuntime(runtime: ReactRuntime): void {
  const cache = getRuntimeCache()
  cache.runtime = runtime
}

export const getRuntime = (): ReactRuntime => {
  const cache = getRuntimeCache()

  if (!cache.runtime) {
    throw new Error('Makeswift context not found. Ensure your page uses `runWithMakeswiftContext`.')
  }
  return cache.runtime
}
