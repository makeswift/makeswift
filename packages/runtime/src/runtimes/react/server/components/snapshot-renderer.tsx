import { type ComponentProps, type PropsWithChildren } from 'react'

import { componentDocumentToRootEmbeddedDocument } from '../../../../client/component-snapshot'
import { MakeswiftComponent } from '../../components/MakeswiftComponent'

import { getRenderContext } from '../render-context'

import { RSCRenderer } from './renderer'

export const RSCSnapshotRenderer = ({
  snapshot,
  label,
  type,
  description,
  children,
}: PropsWithChildren<ComponentProps<typeof MakeswiftComponent>>) => {
  const rootDocument = componentDocumentToRootEmbeddedDocument({
    document: snapshot.document,
    documentKey: snapshot.key,
    name: label,
    type,
    description,
    meta: snapshot.meta,
  })

  const context = getRenderContext()

  return (
    <RSCRenderer context={context} cacheData={snapshot.cacheData} document={rootDocument}>
      {children}
    </RSCRenderer>
  )
}
