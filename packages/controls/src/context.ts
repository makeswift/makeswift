import { type Data, type Element, type ElementData } from './common/types'
import { Slate } from './controls'

export type TranslationDto = Record<string, Data>
export type MergeTranslatableDataContext = {
  translatedData: TranslationDto
  mergeTranslatedData: (node: Element) => Element
  mergeTranslatedNodes?: (
    nodes: Slate.Descendant[],
    translatedData: Record<string, string>,
    plugins: any[],
  ) => Slate.Descendant[]
}

type ResourceMapping = Map<string, string | null>

export const ContextResource = {
  Swatch: 'Swatch',
  File: 'File',
  Typography: 'Typography',
  Table: 'Table',
  TableColumn: 'TableColumn',
  Page: 'Page',
  GlobalElement: 'GlobalElement',
} as const

const resourceFields = {
  [ContextResource.Swatch]: 'swatchIds',
  [ContextResource.File]: 'fileIds',
  [ContextResource.Typography]: 'typographyIds',
  [ContextResource.Table]: 'tableIds',
  [ContextResource.TableColumn]: 'tableColumnIds',
  [ContextResource.Page]: 'pageIds',
  [ContextResource.GlobalElement]: 'globalElementIds',
} as const

type ResourceType = keyof typeof ContextResource
type ResourceField = (typeof resourceFields)[ResourceType]

export type ReplacementContext = {
  [K in ResourceField]: ResourceMapping
} & {
  elementHtmlIds: Set<string>
  elementKeys: Map<string, string>
  globalElementData: Map<string, ElementData>
}

type SerializableResourceMapping = Record<string, string | null>

export type SerializableReplacementContext = {
  [K in ResourceField]?: SerializableResourceMapping
} & {
  elementHtmlIds?: string[]
  elementKeys?: Record<string, string>
  globalElementData?: Record<string, ElementData>
}

export function createReplacementContext(
  context: SerializableReplacementContext = {},
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

export type MergeContext = {
  mergeElement(a: Element, b: Element): Element
}

export type ContextResource =
  (typeof ContextResource)[keyof typeof ContextResource]

function getResourceMapping(
  resourceType: ContextResource,
  ctx: CopyContext,
): ResourceMapping {
  const mapping = ctx.replacementContext[resourceFields[resourceType]]
  if (mapping == null) {
    throw new Error(`Invalid resource type: ${resourceType}`)
  }
  return mapping
}

export function shouldRemoveResource(
  resourceType: ContextResource,
  id: string,
  ctx: CopyContext,
): boolean {
  const mapping = getResourceMapping(resourceType, ctx)
  return mapping.has(id) && mapping.get(id) === null
}

export function replaceResourceIfNeeded(
  resourceType: ContextResource,
  id: string,
  ctx: CopyContext,
): string {
  return getResourceMapping(resourceType, ctx).get(id) ?? id
}
