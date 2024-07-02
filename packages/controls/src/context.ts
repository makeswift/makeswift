import { type Data, type Element, type ElementData } from './common/types'

export type TranslationDto = Record<string, Data>
export type MergeTranslatableDataContext = {
  translatedData: TranslationDto
  mergeTranslatedData: (node: Element) => Element
}

export type ReplacementContext = {
  elementHtmlIds: Set<string>
  elementKeys: Map<string, string>
  swatchIds: Map<string, string>
  fileIds: Map<string, string>
  typographyIds: Map<string, string>
  tableIds: Map<string, string>
  tableColumnIds: Map<string, string>
  pageIds: Map<string, string>
  globalElementIds: Map<string, string>
  globalElementData: Map<string, ElementData>
}

export type SerializableReplacementContext = {
  elementHtmlIds?: string[]
  elementKeys?: Record<string, string>
  swatchIds?: Record<string, string>
  fileIds?: Record<string, string>
  typographyIds?: Record<string, string>
  tableIds?: Record<string, string>
  tableColumnIds?: Record<string, string>
  pageIds?: Record<string, string>
  globalElementIds?: Record<string, string>
  globalElementData?: Record<string, ElementData>
}

export function createReplacementContext(
  context: SerializableReplacementContext,
): ReplacementContext {
  const toMap = <V>(record?: Record<string, V>) =>
    new Map(Object.entries(record ?? {}))

  return {
    elementHtmlIds: new Set(context.elementHtmlIds),
    elementKeys: toMap(context.elementKeys),
    swatchIds: toMap(context.swatchIds),
    fileIds: toMap(context.fileIds),
    typographyIds: toMap(context.typographyIds),
    tableIds: toMap(context.tableIds),
    tableColumnIds: toMap(context.tableColumnIds),
    pageIds: toMap(context.pageIds),
    globalElementIds: toMap(context.globalElementIds),
    globalElementData: toMap(context.globalElementData),
  }
}

export type CopyContext = {
  replacementContext: ReplacementContext
  copyElement: (node: Element) => Element
}
