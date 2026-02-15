import * as Documents from '../modules/read-only-documents'
import * as ElementTrees from '../modules/element-trees'
import { getTranslatableData } from '../../controls/control'
import type {
  DescriptorsByComponentType,
  DescriptorsByProp,
} from '../modules/prop-controllers'
import { deserializeControls } from '../../builder/serialization/control-serialization'

export type SerializedDescriptorsByComponentType = Record<string, Record<string, unknown>>

export type GetTranslatableContentOptions = {
  /**
   * When true, descriptors are treated as DB-persisted serialized form (Record)
   * and deserialized once at the start. Use this when passing row.descriptors from Orion.
   */
  serialized?: boolean
}

function resolveDescriptors(
  descriptors: DescriptorsByComponentType | SerializedDescriptorsByComponentType,
  options: GetTranslatableContentOptions | undefined,
): DescriptorsByComponentType {
  if (options?.serialized !== true) {
    return descriptors as DescriptorsByComponentType
  }

  const serialized = descriptors as SerializedDescriptorsByComponentType
  const resolved: DescriptorsByComponentType = new Map()
  for (const [componentType, propSerialized] of Object.entries(serialized)) {
    resolved.set(
      componentType,
      deserializeControls(propSerialized) as DescriptorsByProp,
    )
  }
  return resolved
}

/**
 * Extracts translatable data from an element tree keyed by `${element.key}:${propName}`.
 *
 * Accepts deserialized descriptors (e.g. getPropControllerDescriptors(store.getState()))
 * or, when options.serialized is true, DB-persisted serialized descriptors (e.g. Orion's
 * row.descriptors). With serialized: true, descriptors are deserialized once at the start.
 */
export function getTranslatableContent(
  descriptors: DescriptorsByComponentType | SerializedDescriptorsByComponentType,
  elementTree: Documents.ElementData,
  options?: GetTranslatableContentOptions,
): Record<string, Documents.Data> {
  const resolvedDescriptors = resolveDescriptors(descriptors, options)
  const translatableData: Record<string, Documents.Data> = {}

  for (const element of ElementTrees.traverseElementTree(
    elementTree,
    resolvedDescriptors,
  )) {
    if (Documents.isElementReference(element)) continue

    const elementDescriptors = resolvedDescriptors.get(element.type)
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
