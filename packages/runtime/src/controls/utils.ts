import { ReplacementContext } from '../state/react-page'
import { ElementData } from './data'

export function createReplacementContextHelper(options?: {
  elementHtmlIds?: Set<string>
  elementKeys?: Map<string, string>
  swatchIds?: Map<string, string>
  fileIds?: Map<string, string>
  typographyIds?: Map<string, string>
  tableIds?: Map<string, string>
  tableColumnIds?: Map<string, string>
  pageIds?: Map<string, string>
  globalElementIds?: Map<string, string>
  globalElementData?: Map<string, ElementData>
}): ReplacementContext {
  return {
    elementHtmlIds: options?.elementHtmlIds ?? new Set<string>(),
    elementKeys: options?.elementKeys ?? new Map<string, string>(),
    swatchIds: options?.swatchIds ?? new Map<string, string>(),
    fileIds: options?.fileIds ?? new Map<string, string>(),
    typographyIds: options?.typographyIds ?? new Map<string, string>(),
    tableIds: options?.tableIds ?? new Map<string, string>(),
    tableColumnIds: options?.tableColumnIds ?? new Map<string, string>(),
    pageIds: options?.pageIds ?? new Map<string, string>(),
    globalElementIds: options?.globalElementIds ?? new Map<string, string>(),
    globalElementData: options?.globalElementData ?? new Map<string, ElementData>(),
  }
}
