import { ComponentPropsWithoutRef } from 'react'
import { prerenderRSCNodes } from './prerender-rsc-nodes'
import { MakeswiftComponent } from '../../runtimes/react/components/MakeswiftComponent'
import { RSCNodesProvider } from '../client/rsc-nodes-provider'
import { RSCRefreshCoordinator } from '../client/rsc-refresh-coordinator'
import { CSSInjector } from '../css/server-css'
import { ClientCSSProvider } from '../css/client-css'
import { componentDocumentToRootEmbeddedDocument } from '../../client'

type Props = ComponentPropsWithoutRef<typeof MakeswiftComponent>

export function RSCMakeswiftComponent(props: Props) {
  const rootDocument = componentDocumentToRootEmbeddedDocument({
    document: props.snapshot.document,
    documentKey: props.snapshot.key,
    name: props.label,
    type: props.type,
    description: props.description,
    meta: props.snapshot.meta,
  })
  const rscNodes = prerenderRSCNodes(rootDocument)

  return (
    <RSCNodesProvider value={rscNodes}>
      <ClientCSSProvider>
        <CSSInjector />
        <RSCRefreshCoordinator
          documentKey={rootDocument.key}
          locale={rootDocument.locale}
        >
          <MakeswiftComponent {...props} />
        </RSCRefreshCoordinator>
      </ClientCSSProvider>
    </RSCNodesProvider>
  )
}
