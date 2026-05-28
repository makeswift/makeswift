import { type ReactNode } from 'react'

import { getComponentsMeta } from '../../../state/modules/components-meta'
import { traverseElementTree } from '../../../state/modules/element-trees'
import { registerDocument } from '../../../state/shared-api'
import { getPropControllerDescriptors } from '../../../state/read-only-state'

import { ServerElement } from './components/element'

import { type ServerRenderContext, getStore } from './render-context'

export type ElementsMap = Map<string, ReactNode>

// Note that this function only creates React element descriptors and associates
// them with the corresponding Makeswift elements; it does not render anything.
//
// The actual render happens when React's server renderer walks the React tree and
// hits the 'use client' boundary at `<ServerElementsCache />`, at which point it
// needs to serialize the `value` prop into the flight stream and thus execute
// `ServerElement` rendering code for each entry in the map.
export function collectServerElements(context: ServerRenderContext): ElementsMap {
  const { document } = context

  const store = getStore(context)
  store.dispatch(registerDocument(document))

  const state = store.getState()
  const descriptors = getPropControllerDescriptors(state)

  const result: ElementsMap = new Map()

  for (const element of traverseElementTree(document.rootElement, descriptors)) {
    const meta = getComponentsMeta(state.componentsMeta).get(element.type)

    if (meta == null) {
      console.warn(`collectServerElements: Component meta not found for ${element.type}`)
      continue
    }

    if (result.has(element.key)) {
      console.warn(`collectServerElements: RSC node already exists for ${element.key}`)
      continue
    }

    if (meta.server) {
      result.set(
        element.key,
        <ServerElement key={element.key} context={context} element={element} />,
      )
    }
  }

  return result
}
