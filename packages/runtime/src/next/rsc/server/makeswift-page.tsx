import { ComponentPropsWithoutRef } from 'react'
import { Page } from '../..'
import { prerenderRSCNodes } from './prerender-rsc-nodes'
import { RSCNodesProvider } from '../client/rsc-nodes-provider'
import { ClientCSSProvider } from '../css/client-css'
import { pageToRootDocument } from '../../../client'

type Props = ComponentPropsWithoutRef<typeof Page>

export function NextRSCMakeswiftPage(props: Props) {
  const rootDocument = pageToRootDocument(props.snapshot.document)
  const rscNodes = prerenderRSCNodes(rootDocument)

  return (
    <RSCNodesProvider value={rscNodes}>
      <ClientCSSProvider>
        <Page {...props} />
      </ClientCSSProvider>
    </RSCNodesProvider>
  )
}
