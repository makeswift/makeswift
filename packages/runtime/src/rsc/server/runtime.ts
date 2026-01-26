import 'server-only'

import { cache } from 'react'
import { ReactRuntime } from '../../runtimes/react/react-runtime'
import { MakeswiftClient, SiteVersion } from '../../unstable-framework-support'
import { Document } from '../../state/react-page'

const getRuntimeCache = cache((): { runtime: ReactRuntime | null } => ({ runtime: null }))

const getSiteVersionCache = cache((): { siteVersion: SiteVersion | null } => ({
  siteVersion: null,
}))

const getDocumentCache = cache((): { document: Document | null } => ({ document: null }))

const getMakeswiftClientCache = cache((): { client: MakeswiftClient | null } => ({ client: null }))

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

export function getMakeswiftClient(): MakeswiftClient {
  const cache = getMakeswiftClientCache()

  if (!cache.client) {
    throw new Error('Makeswift client not found in cache.')
  }
  return cache.client
}

export function getDocumentFromCache(): Document {
  const cache = getDocumentCache()
  if (!cache.document) {
    throw new Error('Document not found in cache.')
  }
  return cache.document
}

export function setMakeswiftClient(client: MakeswiftClient): void {
  const cache = getMakeswiftClientCache()
  cache.client = client
}

export function setDocument(document: Document): void {
  const cache = getDocumentCache()
  cache.document = document
}

export function setSiteVersion(siteVersion: SiteVersion | null): void {
  const cache = getSiteVersionCache()
  cache.siteVersion = siteVersion
}

export function getSiteVersionFromCache(): SiteVersion | null {
  const cache = getSiteVersionCache()
  return cache.siteVersion
}
