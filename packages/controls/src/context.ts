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

type ResourceMapping = Map<string, string | { __type: 'remove' }>

export type ReplacementContext = {
  elementHtmlIds: Set<string>
  elementKeys: Map<string, string>
  swatchIds: ResourceMapping
  fileIds: ResourceMapping
  typographyIds: ResourceMapping
  tableIds: ResourceMapping
  tableColumnIds: ResourceMapping
  pageIds: ResourceMapping
  globalElementIds: ResourceMapping
  globalElementData: Map<string, ElementData>
}

type SerializableResourceMapping = Record<string, string | { __type: 'remove' }>

export type SerializableReplacementContext = {
  elementHtmlIds?: string[]
  elementKeys?: Record<string, string>
  swatchIds?: SerializableResourceMapping
  fileIds?: SerializableResourceMapping
  typographyIds?: SerializableResourceMapping
  tableIds?: SerializableResourceMapping
  tableColumnIds?: SerializableResourceMapping
  pageIds?: SerializableResourceMapping
  globalElementIds?: SerializableResourceMapping
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

export const ContextResource = {
  Swatch: 'Swatch',
  File: 'File',
  Typography: 'Typography',
  Table: 'Table',
  TableColumn: 'TableColumn',
  Page: 'Page',
  GlobalElement: 'GlobalElement',
} as const

export type ContextResource =
  (typeof ContextResource)[keyof typeof ContextResource]

export function shouldRemoveResource(
  type: ContextResource,
  id: string,
  ctx: CopyContext,
): boolean {
  function hasRemoveTag(id: string, map: ResourceMapping): boolean {
    return removeResourceTagSchema.safeParse(map.get(id)).success
  }

  switch (type) {
    case ContextResource.Swatch:
      return hasRemoveTag(id, ctx.replacementContext.swatchIds)
    case ContextResource.File:
      return hasRemoveTag(id, ctx.replacementContext.fileIds)
    case ContextResource.Typography:
      return hasRemoveTag(id, ctx.replacementContext.typographyIds)
    case ContextResource.Table:
      return hasRemoveTag(id, ctx.replacementContext.tableIds)
    case ContextResource.TableColumn:
      return hasRemoveTag(id, ctx.replacementContext.tableColumnIds)
    case ContextResource.Page:
      return hasRemoveTag(id, ctx.replacementContext.pageIds)
    case ContextResource.GlobalElement:
      return hasRemoveTag(id, ctx.replacementContext.globalElementIds)
  }
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

  switch (resourceType) {
    case ContextResource.Swatch:
      return getReplacementId(id, ctx.replacementContext.swatchIds)
    case ContextResource.File:
      return getReplacementId(id, ctx.replacementContext.fileIds)
    case ContextResource.Typography:
      return getReplacementId(id, ctx.replacementContext.typographyIds)
    case ContextResource.Table:
      return getReplacementId(id, ctx.replacementContext.tableIds)
    case ContextResource.TableColumn:
      return getReplacementId(id, ctx.replacementContext.tableColumnIds)
    case ContextResource.Page:
      return getReplacementId(id, ctx.replacementContext.pageIds)
    case ContextResource.GlobalElement:
      return getReplacementId(id, ctx.replacementContext.globalElementIds)
  }
}
