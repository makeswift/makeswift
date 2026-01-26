import { ComponentPropsWithoutRef } from 'react'
import { prerenderRSCNodes } from './prerender-rsc-nodes'
import { Page } from '../../runtimes/react/components/page'
import { RSCNodesProvider } from '../client/rsc-nodes-provider'
import { CSSInjector } from '../css/server-css'
import { ClientCSSProvider } from '../css/client-css'
import { pageToRootDocument } from '../../client'

type Props = ComponentPropsWithoutRef<typeof Page>

export function RSCMakeswiftPage(props: Props) {
  const rootDocument = pageToRootDocument(props.snapshot.document)
  const rscNodes = prerenderRSCNodes(rootDocument)

  return (
    <RSCNodesProvider value={rscNodes}>
      <ClientCSSProvider>
        <CSSInjector />
        <Page {...props} />
      </ClientCSSProvider>
    </RSCNodesProvider>
  )
}
