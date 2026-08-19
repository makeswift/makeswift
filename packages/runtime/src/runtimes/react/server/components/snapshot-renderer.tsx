import { type ComponentProps, type PropsWithChildren } from 'react'

import { componentDocumentToRootEmbeddedDocument } from '../../../../client/component-snapshot'
import { MakeswiftComponent } from '../../components/MakeswiftComponent'

import { getRenderContext } from '../render-context'

import { RSCRenderer } from './renderer'

/**
 * High-level helper for rendering server versions of snapshot-backed components
 * (`MakeswiftComponent`, `Slot`). Creates a root document from the snapshot
 * and delegates to `RSCRenderer` to render the server elements and make them
 * editable on the client.
 */
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
