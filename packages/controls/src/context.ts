import { z } from 'zod'

import { type Data, type Element, type ElementData } from './common/types'

export type TranslationDto = Record<string, Data>
export type MergeTranslatableDataContext = {
  translatedData: TranslationDto
  mergeTranslatedData: (node: Element) => Element
}

const removeResourceTagSchema = z.object({
  __type: z.literal('remove'),
})

export const RemoveResourceTag = { __type: 'remove' } as const

type ResourceMapping = Map<string, string | typeof RemoveResourceTag>

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
type ResourceField = typeof resourceFields[ResourceType]

export type ReplacementContext = {
  [K in ResourceField]: ResourceMapping
} & {
  elementHtmlIds: Set<string>
  elementKeys: Map<string, string>
  globalElementData: Map<string, ElementData>
}

type SerializableResourceMapping = Record<string, string | typeof RemoveResourceTag>

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

export function shouldRemoveResource(
  resourceType: ContextResource,
  id: string,
  ctx: CopyContext,
): boolean {
  function hasRemoveTag(id: string, map: ResourceMapping): boolean {
    return removeResourceTagSchema.safeParse(map.get(id)).success
  }

  return hasRemoveTag(id, ctx.replacementContext[resourceFields[resourceType]])
}

export function getReplacementResourceId(
  resourceType: ContextResource,
  id: string,
  ctx: CopyContext,
): string | null {
  function getReplacementId(id: string, map: ResourceMapping): string | null {
    const replacement = map.get(id) ?? null
    return typeof replacement === 'string' ? replacement : null
  }

  return getReplacementId(id, ctx.replacementContext[resourceFields[resourceType]])
}
