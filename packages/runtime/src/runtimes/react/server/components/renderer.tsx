import { type PropsWithChildren } from 'react'

import { type CacheData } from '../../../../api/api-resources-client'
import { type Document } from '../../../../state/modules/read-only-documents'

import { InjectServerCSS } from '../css/server-css'
import { ClientCSSProvider } from '../css/client-css'

import { type ServerRenderContext } from '../render-context'
import { collectServerElements } from '../collect-server-elements'

import { ServerElementsCache } from './server-elements-cache'

export function RSCRenderer({
  context,
  document,
  cacheData,
  children,
}: PropsWithChildren<{ context: ServerRenderContext; document: Document; cacheData: CacheData }>) {
  const serverElements = collectServerElements(context, document, cacheData)

  return (
    <ServerElementsCache value={serverElements}>
      <ClientCSSProvider>
        <InjectServerCSS collector={context.cssCollector} />
        {children}
      </ClientCSSProvider>
    </ServerElementsCache>
  )
}
