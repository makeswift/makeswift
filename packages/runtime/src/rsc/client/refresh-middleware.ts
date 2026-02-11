import { type Middleware } from '@reduxjs/toolkit'

import { type State, Element } from '../../state/react-page'
import * as ComponentsMeta from '../../state/modules/components-meta'
import { ActionTypes, type Action, type DocumentPayload } from '../../state/actions'
import { actionMiddleware } from '../../state/toolkit'
import { traverseElementTree } from '../../state/modules/element-trees'
import { type DescriptorsByComponentType } from '../../state/modules/prop-controllers'

export const RSC_ELEMENT_ADDED_EVENT = 'makeswift:rsc-element-added'
export const RSC_ELEMENT_REMOVED_EVENT = 'makeswift:rsc-element-removed'
export const RSC_RESOURCE_CHANGED_EVENT = 'makeswift:rsc-resource-changed'

export type RSCElementAddedDetail = {
  elementData: Element
  documentKey: string
}

export type RSCElementRemovedDetail = {
  elementKey: string
}

/**
 * Creates a Redux middleware that dispatches custom events when RSC elements are
 * added/removed or API resources change. These events are consumed by the
 * RSCRefreshCoordinator and RSCBuilderUpdater on the client side.
 *
 * @param refresh - Legacy callback for full RSC refresh (kept for backward compatibility with HMR/navigation)
 */
export function createRSCRefreshMiddleware(_refresh: () => void): Middleware {
  return actionMiddleware<State, Action>(({ getState }) => next => {
    return action => {
      switch (action.type) {
        case ActionTypes.CHANGE_ELEMENT_TREE: {
          const { oldDocument, newDocument, descriptors } = action.payload
          const componentsMeta = ComponentsMeta.getComponentsMeta(getState().componentsMeta)

          // Detect newly added server elements
          const newlyAddedElements = getNewlyAddedElements(oldDocument, newDocument, descriptors)
          for (const element of newlyAddedElements) {
            const meta = componentsMeta.get(element.type)
            if (meta?.server) {
              console.log(`[RSC] element "${element.type}" added, dispatching element-added event`)
              if (typeof window !== 'undefined') {
                window.dispatchEvent(
                  new CustomEvent<RSCElementAddedDetail>(RSC_ELEMENT_ADDED_EVENT, {
                    detail: { elementData: element, documentKey: newDocument.key },
                  }),
                )
              }
            }
          }

          // Detect removed server elements
          const removedElements = getRemovedElements(oldDocument, newDocument, descriptors)
          for (const element of removedElements) {
            const meta = componentsMeta.get(element.type)
            if (meta?.server) {
              console.log(
                `[RSC] element "${element.type}" removed, dispatching element-removed event`,
              )
              if (typeof window !== 'undefined') {
                window.dispatchEvent(
                  new CustomEvent<RSCElementRemovedDetail>(RSC_ELEMENT_REMOVED_EVENT, {
                    detail: { elementKey: element.key },
                  }),
                )
              }
            }
          }

          break
        }

        case ActionTypes.CHANGE_API_RESOURCE: {
          // Notify all mounted RSCBuilderUpdaters to re-render their elements
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent(RSC_RESOURCE_CHANGED_EVENT))
          }
          break
        }
      }

      return next(action)
    }
  })
}

function getNewlyAddedElements(
  oldDoc: DocumentPayload,
  newDoc: DocumentPayload,
  descriptors: DescriptorsByComponentType,
): Element[] {
  const oldElementKeys = new Set<string>()
  const newElements: Element[] = []

  for (const element of traverseElementTree(oldDoc.rootElement, descriptors)) {
    oldElementKeys.add(element.key)
  }

  for (const element of traverseElementTree(newDoc.rootElement, descriptors)) {
    if (!oldElementKeys.has(element.key)) {
      newElements.push(element)
    }
  }

  return newElements
}

function getRemovedElements(
  oldDoc: DocumentPayload,
  newDoc: DocumentPayload,
  descriptors: DescriptorsByComponentType,
): Element[] {
  const newElementKeys = new Set<string>()
  const removedElements: Element[] = []

  for (const element of traverseElementTree(newDoc.rootElement, descriptors)) {
    newElementKeys.add(element.key)
  }

  for (const element of traverseElementTree(oldDoc.rootElement, descriptors)) {
    if (!newElementKeys.has(element.key)) {
      removedElements.push(element)
    }
  }

  return removedElements
}
