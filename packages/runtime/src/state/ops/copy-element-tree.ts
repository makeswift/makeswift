import {
  createReplacementContext,
  type SerializableReplacementContext,
  type ReplacementContext,
  CopyContext,
  replaceResourceIfNeeded,
  ContextResource,
} from '@makeswift/controls'

import { copy as copyFromControl } from '../../controls/control'

import * as Documents from '../modules/read-only-documents'

import { type State, getComponentPropControllerDescriptors } from '../read-only-state'

export function copyElementTree(
  state: State,
  elementTree: Documents.ElementData,
  replacementContext: SerializableReplacementContext,
) {
  /*
   * This is structured a bit weird.
   *
   * This is done so that we can pass a callable function into some of the copy functions
   * themselves, to enable mutual recursion.
   *
   * Consider the slot control. It has to iterate through its elements, and for each of them,
   * call some version of the below function.
   *
   * That is how the recursing through the tree happens.
   */
  function copyElementTreeNode(state: State, replacementContext: ReplacementContext) {
    return function (node: Documents.Element) {
      const context: CopyContext = {
        replacementContext,
        copyElement: copyElementTreeNode(state, replacementContext),
      }

      if (Documents.isElementReference(node)) {
        return {
          ...node,
          value: replaceResourceIfNeeded(ContextResource.GlobalElement, node.value, context),
        }
      }

      const descriptors = getComponentPropControllerDescriptors(state, node.type)

      if (descriptors == null) return node

      for (const [propKey, descriptor] of Object.entries(descriptors)) {
        node.props[propKey] = copyFromControl(descriptor, node.props[propKey], context)
      }

      return node
    }
  }

  const copy = JSON.parse(JSON.stringify(elementTree)) as Documents.ElementData

  return copyElementTreeNode(state, createReplacementContext(replacementContext))(copy)
}
