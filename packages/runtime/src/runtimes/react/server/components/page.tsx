import { type ComponentPropsWithoutRef } from 'react'

import { Page } from '../../components/page'
import { pageToRootDocument } from '../../../../client'

import { CSSInjector } from '../css/server-css'
import { ClientCSSProvider } from '../css/client-css'

import { createServerRenderContext, type ServerRenderBaseContext } from '../render-context'
import { collectServerElements } from '../collect-server-elements'

import { ServerElementsCache } from './server-elements-cache'

type Props = ComponentPropsWithoutRef<typeof Page> & {
  serverContext: ServerRenderBaseContext
}

export function RSCPage(props: Props) {
  const { serverContext, ...pageProps } = props
  const rootDocument = pageToRootDocument(props.snapshot.document)

  const context = createServerRenderContext(serverContext, rootDocument)
  const serverElements = collectServerElements(context)

  return (
    <ServerElementsCache value={serverElements}>
      <ClientCSSProvider>
        <CSSInjector />
        <Page {...pageProps} />
      </ClientCSSProvider>
    </ServerElementsCache>
  )
}
