import { getPropControllerDescriptors, type State } from '../read-only-state'
import * as Documents from '../modules/read-only-documents'
import * as ElementTrees from '../modules/element-trees'
import { getTranslatableData } from '../../controls/control'

export function getElementTreeTranslatableData(
  state: State,
  elementTree: Documents.ElementData,
): Record<string, Documents.Data> {
  const translatableData: Record<string, Documents.Data> = {}
  const descriptors = getPropControllerDescriptors(state)

  for (const element of ElementTrees.traverseElementTree(elementTree, descriptors)) {
    if (Documents.isElementReference(element)) continue

    const elementPescriptors = descriptors.get(element.type)
    if (elementPescriptors == null) continue

    Object.entries(elementPescriptors).forEach(([propName, descriptor]) => {
      const translatablePropData = getTranslatableData(descriptor, element.props[propName])

      if (translatablePropData != null) {
        translatableData[`${element.key}:${propName}`] = translatablePropData
      }
    })
  }

  return translatableData
}
