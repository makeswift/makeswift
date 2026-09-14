import { type ReactNode } from 'react'

import { isElementReference } from '@makeswift/controls'

import { type CacheData } from '../../../api/api-resources-client'

import {
  type Document,
  type Element,
  type ElementData,
} from '../../../state/modules/read-only-documents'
import { getComponentsMeta } from '../../../state/modules/components-meta'
import { traverseElementTree } from '../../../state/modules/element-trees'
import { registerDocument } from '../../../state/shared-api'
import { getPropControllerDescriptors } from '../../../state/read-only-state'

import { ServerElement } from './components/element'

import { type ServerRenderContext, getStore } from './render-context'
import { updateApiResourceCache } from './update-api-resource-cache'

export type ElementsMap = Map<string, ReactNode>

/**
 * Collects React nodes for document's server elements into a map keyed by
 * element key.
 *
 * Note that this function only *creates* React elements and associates them
 * with the corresponding Makeswift elements; it does not render anything.
 *
 * The actual render happens when React's server renderer walks the React tree
 * and hits the 'use client' boundary at `<ServerElementsCache />`, at which
 * point it needs to serialize the `value` prop into the flight stream and thus
 * execute `ServerElement` rendering code for each entry in the map.
 */
export function collectServerElements(
  context: ServerRenderContext,
  document: Document,
  cacheData: CacheData,
): ElementsMap {
  const store = getStore(context)
  updateApiResourceCache(store, cacheData)

  store.dispatch(registerDocument(document))

  const state = store.getState()
  const descriptors = getPropControllerDescriptors(state)

  const result: ElementsMap = new Map()
  const rootElements = [document.rootElement]
  let rootElement: Element | undefined

  while ((rootElement = rootElements.pop())) {
    for (const element of traverseElementTree(rootElement, descriptors)) {
      if (isElementReference(element)) {
        const globalElement = store.apiResourcesClient.readGlobalElement(element.value)
        console.log('@@ collectServerElements globalElement', element, globalElement)
        const elementData = globalElement?.data as ElementData | undefined
        if (elementData != null) {
          rootElements.push(elementData)
        } else {
          console.warn(`collectServerElements: missing global element ${element.value}`, element)
        }
        continue
      }

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
          <ServerElement
            key={element.key}
            context={context}
            element={element}
            documentKey={document.key}
          />,
        )
      }
    }
  }

  return result
}
