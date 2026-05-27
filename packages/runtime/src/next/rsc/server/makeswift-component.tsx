import { ComponentPropsWithoutRef } from 'react'

import { componentDocumentToRootEmbeddedDocument } from '../../../client'
import { MakeswiftComponent } from '../../../runtimes/react/components/MakeswiftComponent'

import { ClientCSSProvider } from '../css/client-css'
import { RSCNodesProvider } from '../client/rsc-nodes-provider'

import { prerenderRSCNodes } from './prerender-rsc-nodes'

type Props = ComponentPropsWithoutRef<typeof MakeswiftComponent>

export function NextRSCMakeswiftComponent(props: Props) {
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
        <MakeswiftComponent {...props} />
      </ClientCSSProvider>
    </RSCNodesProvider>
  )
}