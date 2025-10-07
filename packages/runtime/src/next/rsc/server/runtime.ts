import 'server-only'

import { cache } from 'react'
import { ReactRuntime } from '../../../runtimes/react/react-runtime'
import { SiteVersion } from '../../../unstable-framework-support'

const getRuntimeCache = cache((): { runtime: ReactRuntime | null } => ({ runtime: null }))
const getSiteVersionCache = cache((): { siteVersion: SiteVersion | null } => ({
  siteVersion: null,
}))

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

export function setSiteVersion(siteVersion: SiteVersion | null): void {
  const cache = getSiteVersionCache()
  cache.siteVersion = siteVersion
}

export function getSiteVersionFromCache(): SiteVersion | null {
  const cache = getSiteVersionCache()
  return cache.siteVersion
}
