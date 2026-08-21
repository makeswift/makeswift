import { type PropsWithChildren } from 'react'

import { type CacheData } from '../../../../api/api-resources-client'
import { type Document } from '../../../../state/modules/read-only-documents'

import { type ServerRenderContext, getStore } from '../render-context'
import { collectServerElements } from '../collect-server-elements'
import { updateApiResourceCache } from '../update-api-resource-cache'

import { ServerElementsProvider } from './server-elements-cache'

/**
 * Helper for rendering a Makeswift document containing server elements. Makes
 * the server-rendered nodes available to the client renderer and enables
 * client-side style updates for editable server elements.
 */
export function RSCRenderer({
  context,
  document,
  cacheData,
  children,
}: PropsWithChildren<{ context: ServerRenderContext; document: Document; cacheData: CacheData }>) {
  const serverElements = collectServerElements(context, document, cacheData)

  return <ServerElementsProvider elements={serverElements}>{children}</ServerElementsProvider>
}

/**
 * Helper for (re-)rendering an isolated server element. Updates the server
 * state with the context's API resource cache.
 */
export function RSCElementRenderer({
  context,
  cacheData,
  children,
}: PropsWithChildren<{ context: ServerRenderContext; cacheData: CacheData }>) {
  const store = getStore(context)

  updateApiResourceCache(store, cacheData)
  return <>{children}</>
}
