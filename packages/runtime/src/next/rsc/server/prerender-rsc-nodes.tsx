import { getRuntime, setDocument } from './runtime'
import { getComponentsMeta } from '../../../state/modules/components-meta'
import { Document, getPropControllerDescriptors } from '../../../state/react-page'
import { ServerElement } from './server-element'
import { traverseElementTree } from '../../../state/modules/element-trees'
import { RSCNodes } from '../client/rsc-nodes-provider'
import { registerDocument } from '../../../state/actions'

export function prerenderRSCNodes(document: Document): RSCNodes {
  setDocument(document)

  const runtime = getRuntime()
  runtime.store.dispatch(registerDocument(document))
  const state = runtime.store.getState()

  const descriptors = getPropControllerDescriptors(state)
  const rscNodes: RSCNodes = new Map()

  for (const element of traverseElementTree(document.rootElement, descriptors)) {
    const meta = getComponentsMeta(state.componentsMeta).get(element.type)

    if (meta == null) {
      console.warn(`[prerenderRSCNodes] Component meta not found for ${element.type}`)
      continue
    }

    if (rscNodes.has(element.key)) {
      console.warn(`[prerenderRSCNodes] RSC node already exists for ${element.key}`)
      continue
    }

    if (meta.server) {
      rscNodes.set(element.key, <ServerElement key={element.key} element={element} />)
    }
  }

  return rscNodes
}
