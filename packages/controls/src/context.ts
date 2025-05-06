import { z } from 'zod'

import { type Data, type Element, type ElementData } from './common/types'

export type TranslationDto = Record<string, Data>
export type MergeTranslatableDataContext = {
  translatedData: TranslationDto
  mergeTranslatedData: (node: Element) => Element
}

export const removeResourceTagSchema = z.object({
  __type: z.literal('ReplacementContextAction'),
  action: z.literal('remove'),
})

type RemoveResourceTag = z.infer<typeof removeResourceTagSchema>

export function createRemoveTag(): RemoveResourceTag {
  return {
    __type: 'ReplacementContextAction',
    action: 'remove',
  } as const
}

function isRemoveResourceTag(
  value: string | RemoveResourceTag | null | undefined,
): value is RemoveResourceTag {
  return removeResourceTagSchema.safeParse(value).success
}

type ResourceMapping = Map<string, string | RemoveResourceTag>

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

type SerializableResourceMapping = Record<string, string | RemoveResourceTag>

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

function shouldRemoveResource(id: string, map: ResourceMapping): boolean {
  return isRemoveResourceTag(map.get(id))
}

function getReplacementResourceId(
  id: string,
  map: Map<string, string | RemoveResourceTag>,
): string | null {
  const replacement = map.get(id)
  return typeof replacement === 'string' ? replacement : null
}

export function shouldRemoveSwatch(
  swatchId: string,
  ctx: CopyContext,
): boolean {
  return shouldRemoveResource(swatchId, ctx.replacementContext.swatchIds)
}

export function getReplacementSwatchId(
  swatchId: string,
  ctx: CopyContext,
): string | null {
  return getReplacementResourceId(swatchId, ctx.replacementContext.swatchIds)
}

export function shouldRemoveFile(fileId: string, ctx: CopyContext): boolean {
  return shouldRemoveResource(fileId, ctx.replacementContext.fileIds)
}

export function getReplacementFileId(
  fileId: string,
  ctx: CopyContext,
): string | null {
  return getReplacementResourceId(fileId, ctx.replacementContext.fileIds)
}

export function shouldRemoveTypography(
  typographyId: string,
  ctx: CopyContext,
): boolean {
  return shouldRemoveResource(
    typographyId,
    ctx.replacementContext.typographyIds,
  )
}

export function getReplacementTypographyId(
  typographyId: string,
  ctx: CopyContext,
): string | null {
  return getReplacementResourceId(
    typographyId,
    ctx.replacementContext.typographyIds,
  )
}

export function shouldRemoveTable(tableId: string, ctx: CopyContext): boolean {
  return shouldRemoveResource(tableId, ctx.replacementContext.tableIds)
}

export function getReplacementTableId(
  tableId: string,
  ctx: CopyContext,
): string | null {
  return getReplacementResourceId(tableId, ctx.replacementContext.tableIds)
}

export function shouldRemoveTableColumn(
  tableColumnId: string,
  ctx: CopyContext,
): boolean {
  return shouldRemoveResource(
    tableColumnId,
    ctx.replacementContext.tableColumnIds,
  )
}

export function getReplacementTableColumnId(
  tableColumnId: string,
  ctx: CopyContext,
): string | null {
  return getReplacementResourceId(
    tableColumnId,
    ctx.replacementContext.tableColumnIds,
  )
}

export function shouldRemovePage(pageId: string, ctx: CopyContext): boolean {
  return shouldRemoveResource(pageId, ctx.replacementContext.pageIds)
}

export function getReplacementPageId(
  pageId: string,
  ctx: CopyContext,
): string | null {
  return getReplacementResourceId(pageId, ctx.replacementContext.pageIds)
}

export function shouldRemoveGlobalElement(
  globalElementId: string,
  ctx: CopyContext,
): boolean {
  return shouldRemoveResource(
    globalElementId,
    ctx.replacementContext.globalElementIds,
  )
}

export function getReplacementGlobalElementId(
  globalElementId: string,
  ctx: CopyContext,
): string | null {
  return getReplacementResourceId(
    globalElementId,
    ctx.replacementContext.globalElementIds,
  )
}
