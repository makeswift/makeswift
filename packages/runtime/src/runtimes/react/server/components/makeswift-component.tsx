import {
  componentDocumentToRootEmbeddedDocument,
  MakeswiftComponentSnapshot,
} from '../../../../client/component-snapshot'

import { MakeswiftComponent as MakeswiftClientComponent } from '../../components/MakeswiftComponent'

import { RSCRenderer } from './renderer'
import { getRenderContext } from '../render-context'

type Props = {
  snapshot: MakeswiftComponentSnapshot
  label: string
  type: string
  description?: string
}

export const MakeswiftServerComponent = ({ snapshot, label, type, description }: Props) => {
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
      <MakeswiftClientComponent {...{ snapshot, label, type, description }} />
    </RSCRenderer>
  )
}
