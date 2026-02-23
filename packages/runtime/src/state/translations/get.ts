import * as Documents from '../modules/read-only-documents'
import * as ElementTrees from '../modules/element-trees'
import { getTranslatableData } from '../../controls/control'
import type {DescriptorsByComponentType} from '../modules/prop-controllers'

export function getTranslatableContent(
  descriptors: DescriptorsByComponentType,
  elementTree: Documents.ElementData,
): Record<string, Documents.Data> {
  const translatableData: Record<string, Documents.Data> = {}

  for (const element of ElementTrees.traverseElementTree(
    elementTree,
    descriptors,
  )) {
    if (Documents.isElementReference(element)) continue

    const elementDescriptors = descriptors.get(element.type)
    if (elementDescriptors == null) continue

    Object.entries(elementDescriptors).forEach(([propName, descriptor]) => {
      const translatablePropData = getTranslatableData(descriptor, element.props[propName])

      if (translatablePropData != null) {
        translatableData[`${element.key}:${propName}`] = translatablePropData
      }
    })
  }

  return translatableData
}
