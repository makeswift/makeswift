import { ComponentPropsWithoutRef } from 'react'
import { Page } from '../..'
import { prerenderRSCNodes } from './prerender-rsc-nodes'
import { RSCNodesProvider } from '../client/rsc-nodes-provider'
import { CSSInjector } from '../css/server-css'
import { ClientCSSProvider } from '../css/client-css'

type Props = ComponentPropsWithoutRef<typeof Page>

export function NextRSCMakeswiftPage(props: Props) {
  const rscNodes = prerenderRSCNodes(props.snapshot.document.data)

  return (
    <RSCNodesProvider value={rscNodes}>
      <ClientCSSProvider>
        <CSSInjector />
        <Page {...props} />
      </ClientCSSProvider>
    </RSCNodesProvider>
  )
}
