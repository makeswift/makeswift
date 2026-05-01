import { getRuntime, setDocument } from './runtime'
import { getComponentsMeta } from '../../../state/modules/components-meta'
import {
  Document,
  Element,
  getComponentPropControllerDescriptors,
  getPropControllerDescriptors,
  isElementReference,
} from '../../../state/read-only-state'
import { ServerElement } from './server-element'
import { traverseElementTree } from '../../../state/modules/element-trees'
import { RSCNodes } from '../client/rsc-nodes-provider'
import { registerDocument } from '../../../state/shared-api'
import { resolveProps } from './resolve-props'

export async function prerenderRSCNodes(document: Document): Promise<RSCNodes> {
  setDocument(document)

  const runtime = getRuntime()
  runtime.protoStore.dispatch(registerDocument(document))
  const state = runtime.protoStore.getState()

  const descriptors = getPropControllerDescriptors(state)
  const rscNodes: RSCNodes = new Map()
  const seen = new Set<string>()
  const rscElements: Element[] = []

  for (const element of traverseElementTree(document.rootElement, descriptors)) {
    const meta = getComponentsMeta(state.componentsMeta).get(element.type)

    if (meta == null) {
      console.warn(`[prerenderRSCNodes] Component meta not found for ${element.type}`)
      continue
    }

    if (seen.has(element.key)) {
      console.warn(`[prerenderRSCNodes] RSC node already exists for ${element.key}`)
      continue
    }

    if (!meta.server) continue

    seen.add(element.key)
    rscElements.push(element)
  }

  // Resolve props for every RSC element up front so the CSS collector is
  // fully populated before <CSSInjector/> renders.
  const resolvedPropsList = await Promise.all(
    rscElements.map(async element => {
      if (isElementReference(element)) return null
      const componentDescriptors = getComponentPropControllerDescriptors(state, element.type)
      if (componentDescriptors == null) return null
      return resolveProps(element, componentDescriptors)
    }),
  )

  rscElements.forEach((element, i) => {
    rscNodes.set(
      element.key,
      <ServerElement key={element.key} element={element} resolvedProps={resolvedPropsList[i]} />,
    )
  })

  return rscNodes
}
