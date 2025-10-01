import { MergeTranslatableDataContext, type TranslationDto, type Data } from '@makeswift/controls'
import { getPropControllerDescriptors, type State } from '../react-page'
import * as Documents from '../modules/read-only-documents'
import {
  GridPropControllerData,
  mergeGridPropControllerTranslatedData,
  Types as PropControllerTypes,
} from '@makeswift/prop-controllers'
import { ReactMergeTranslationsVisitor } from '../../controls/visitors/merge-translations-visitor'
import { isLegacyDescriptor } from '../../prop-controllers/descriptors'
import { Descriptor as PropControllerDescriptor } from '../../prop-controllers/descriptors'

export function mergeElementTreeTranslatedData(
  state: State,
  elementTree: Documents.ElementData,
  translatedData: TranslationDto,
): Documents.Element {
  function merge(state: State, translatedData: TranslationDto) {
    return function (node: Documents.Element): Documents.Element {
      if (Documents.isElementReference(node)) return node

      const elementDescriptors = getPropControllerDescriptors(state)
      const descriptors = elementDescriptors.get(node.type)

      if (descriptors == null) {
        throw new Error(`Can't merge element of type "${node.type}" because it has no descriptors`)
      }

      const context: MergeTranslatableDataContext = {
        translatedData,
        mergeTranslatedData: merge(state, translatedData),
      }
      const props = {} as Record<string, Documents.Data>

      for (const propName of Object.keys(descriptors)) {
        const descriptor = descriptors[propName]

        props[propName] = mergeTranslatedData(
          descriptor,
          node.props[propName],
          translatedData[`${node.key}:${propName}`],
          context,
        )
      }

      return { ...node, props }
    }
  }
  return merge(state, translatedData)(elementTree)
}

export function mergeTranslatedData(
  definition: PropControllerDescriptor,
  data: Data,
  translatedData: Data,
  context: MergeTranslatableDataContext,
): Data {
  if (data == null) return data
  if (!isLegacyDescriptor(definition)) {
    const mergeTranslationsVisitor = new ReactMergeTranslationsVisitor(context)
    return definition.accept(mergeTranslationsVisitor, data, translatedData)
  }

  switch (definition.type) {
    case PropControllerTypes.TextInput:
    case PropControllerTypes.TextArea:
      if (translatedData == null) return data
      return translatedData

    case PropControllerTypes.Grid:
      return mergeGridPropControllerTranslatedData(data as GridPropControllerData, context)

    default:
      return data
  }
}
