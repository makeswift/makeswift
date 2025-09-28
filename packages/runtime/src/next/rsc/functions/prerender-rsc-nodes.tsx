import { getRuntime } from '../server/runtime'
import { getComponentsMeta } from '../../../state/modules/components-meta'
import { Element, getPropControllerDescriptors } from '../../../state/react-page'
import { ServerElement } from '../components/server-element'
import { traverseElementTree } from '../../../state/modules/element-trees'

export function prerenderRSCNodes(elementTree: Element): Record<string, JSX.Element> {
  const runtime = getRuntime()
  const state = runtime.store.getState()
  const descriptors = getPropControllerDescriptors(state)

  const rscNodes: Record<string, JSX.Element> = {}

  for (const element of traverseElementTree(elementTree, descriptors)) {
    const meta = getComponentsMeta(state.componentsMeta).get(element.type)
    if (meta == null) {
      console.warn(`Component meta not found for ${element.type}`)
      continue
    }

    if (meta.server) {
      rscNodes[element.key] = <ServerElement key={element.key} element={element} />
    }
  }

  return rscNodes
}
