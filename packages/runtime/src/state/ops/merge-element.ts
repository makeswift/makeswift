import { type MergeContext } from '@makeswift/controls'

import { merge } from '../../controls/control'

import * as Documents from '../modules/read-only-documents'

import { type State, getPropControllerDescriptors } from '../read-only-state'

export function mergeElement(
  state: State,
  baseElement: Documents.Element,
  overrideElement: Documents.Element,
): Documents.Element {
  if (baseElement.type !== overrideElement.type || baseElement.key !== overrideElement.key) {
    throw new Error(`Can't merge elements of different types or keys`)
  }

  if (Documents.isElementReference(overrideElement)) return overrideElement

  if (Documents.isElementReference(baseElement)) return baseElement

  const elementDescriptors = getPropControllerDescriptors(state)
  const descriptors = elementDescriptors.get(baseElement.type)

  if (descriptors == null) {
    throw new Error(
      `Can't merge element of type "${baseElement.type}" because it has no descriptors`,
    )
  }

  const mergedProps = {} as Record<string, Documents.Data>

  for (const propName of Object.keys(descriptors)) {
    const descriptor = descriptors[propName]
    const context: MergeContext = {
      mergeElement(base, override) {
        return mergeElement(state, base, override)
      },
    }

    mergedProps[propName] = merge(
      descriptor,
      baseElement.props[propName],
      overrideElement.props[propName],
      context,
    )
  }

  return { ...baseElement, props: mergedProps }
}
