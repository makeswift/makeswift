import { z } from 'zod'
import {
  APIResourceType,
  File,
  GlobalElement,
  LocalizedGlobalElement,
  PagePathnameSlice,
  Swatch,
  Table,
  Typography,
} from '../api'
import { GraphQLClient } from '../api/graphql/client'
import { FileQuery, IntrospectedResourcesQuery, TableQuery } from '../api/graphql/documents'
import {
  FileQueryResult,
  FileQueryVariables,
  IntrospectedResourcesQueryResult,
  IntrospectedResourcesQueryVariables,
  SnippetLocation,
  TableQueryResult,
  TableQueryVariables,
} from '../api/graphql/generated/types'

import { CacheData } from '../api/client'
import { Descriptor as PropControllerDescriptor } from '../prop-controllers/descriptors'
import {
  getElementChildren,
  getSwatchIds,
  getFileIds,
  getPageIds,
  getTableIds,
  getTypographyIds,
} from '../prop-controllers/introspection'
import { type ReactRuntimeCore } from '../runtimes/react/react-runtime-core'
import {
  type Element,
  type ElementData,
  type Data,
  type Document,
  getPropControllerDescriptors,
  isElementReference,
} from '../state/read-only-state'
import { type SiteVersion } from '../api/site-version'
import { toIterablePaginationResult } from '../utils/pagination'
import { deterministicUUID } from '../utils/deterministic-uuid'
import { Schema } from '@makeswift/controls'
import { EMBEDDED_DOCUMENT_TYPE, EmbeddedDocument } from '../state/modules/read-only-documents'
import { mergeTranslatedContent } from '../state/translations/merge'
import { getTranslatableContent } from '../state/translations/get'
import { isNonNullable } from '../utils/isNonNullable'

export { SnippetLocation } from '../api/graphql/generated/types'

const makeswiftPageResultSchema = z.object({
  id: z.string(),
  path: z.string(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  canonicalUrl: z.string().nullable(),
  socialImageUrl: z.string().nullable(),
  sitemapPriority: z.number().nullable(),
  sitemapFrequency: z
    .enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
    .nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().nullable(),
  isOnline: z.boolean().nullable(),
  excludedFromSearch: z.boolean().nullable(),
  locale: z.string(),
  localizedVariants: z.array(
    z.object({
      locale: z.string(),
      path: z.string(),
    }),
  ),
})

const makeswiftGetPagesResultAPISchema = z.object({
  data: z.array(makeswiftPageResultSchema),
  hasMore: z.boolean(),
})

const makeswiftGetPagesParamsSchema = z.object({
  limit: z.number().optional(),
  after: z.string().optional(),
  sortBy: z.enum(['title', 'path', 'description', 'createdAt', 'updatedAt']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  includeOffline: z.boolean().optional(),
  pathPrefix: z.string().optional(),
  locale: z.string().optional(),
})

function getPagesQueryParams({
  limit = 100,
  after,
  sortBy,
  sortDirection,
  includeOffline,
  pathPrefix,
  locale,
}: GetPagesParams): URLSearchParams {
  const params = new URLSearchParams()

  if (limit != null) params.set('limit', limit.toString())
  if (after != null) params.set('after', after)
  if (sortBy != null) params.set('sortBy', sortBy)
  if (sortDirection != null) params.set('sortDirection', sortDirection)
  if (includeOffline != null) params.set('includeOffline', includeOffline.toString())
  if (pathPrefix != null) params.set('pathPrefix', pathPrefix)
  if (locale != null) params.set('locale', locale)

  return params
}

type GetPagesParams = z.infer<typeof makeswiftGetPagesParamsSchema>
export type MakeswiftPage = z.infer<typeof makeswiftPageResultSchema>
export type MakeswiftGetPagesResult = z.infer<typeof makeswiftGetPagesResultAPISchema>

export type MakeswiftPageDocument = {
  id: string
  site: { id: string }
  data: Element
  snippets: Snippet[]
  fonts: Font[]
  meta: Meta
  seo: Seo
  localizedPages: LocalizedPage[]
  locale: string | null
}

export function pageToRootDocument(pageDocument: MakeswiftPageDocument): Document {
  const { locale, localizedPages, id, data } = pageDocument
  const localizedPage = localizedPages.find(({ parentId }) => parentId == null)
  return localizedPage
    ? { key: localizedPage.elementTreeId, rootElement: localizedPage.data, locale }
    : { key: id, rootElement: data, locale }
}

export type MakeswiftPageSnapshot = {
  document: MakeswiftPageDocument
  cacheData: CacheData
}

const makeswiftComponentDocumentSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  locale: z.string().nullable(),
  data: Schema.element,
  siteId: z.string(),
  inheritsFromParent: z.boolean(),
})

export type MakeswiftComponentDocument = z.infer<typeof makeswiftComponentDocumentSchema>

const makeswiftComponentDocumentFallbackSchema = z.object({
  id: z.string(),
  locale: z.string().nullable(),
  data: z.null(),
})

export type MakeswiftComponentDocumentFallback = z.infer<
  typeof makeswiftComponentDocumentFallbackSchema
>

export type MakeswiftComponentSnapshotMetadata = {
  allowLocaleFallback: boolean
  requestedLocale: string | null
}

export type MakeswiftComponentSnapshot = {
  document: MakeswiftComponentDocument | MakeswiftComponentDocumentFallback
  key: string
  cacheData: CacheData
  meta: MakeswiftComponentSnapshotMetadata
}

export const previewTokenPayloadSchema = z.object({
  payload: z.object({
    version: z.string(),
  }),
})

export type PreviewTokenPayload = z.infer<typeof previewTokenPayloadSchema>

export function componentDocumentToRootEmbeddedDocument({
  document,
  documentKey,
  name,
  type,
  description,
  meta,
}: {
  document: MakeswiftComponentDocument | MakeswiftComponentDocumentFallback
  documentKey: string
  name: string
  type: string
  description?: string
  meta: MakeswiftComponentSnapshotMetadata
}): EmbeddedDocument {
  const { data: rootElement, locale, id } = document

  if (rootElement != null && rootElement.type !== type) {
    throw new Error(
      `Type "${rootElement.type}" does not match the expected type "${type}" from the snapshot`,
    )
  }

  const rootDocument: EmbeddedDocument = {
    key: documentKey,
    rootElement: rootElement ?? {
      // Fallback rootElement
      // Create a stable uuid so two different clients will have the same empty element data.
      // This is needed to make presence feature work for an element that is not yet created.
      key: deterministicUUID({ id, locale, seed: documentKey }),
      type,
      props: {},
    },
    locale,
    id,
    type,
    name,
    meta: { ...meta, description },
    __type: EMBEDDED_DOCUMENT_TYPE,
  }

  return rootDocument
}

// This function attempts to consume the response body of a failed response, and
// returns either the parsed JSON or raw text. This is useful for logging more
// detailed error information when an API request fails.
//
// Cloudflare Worker Note: The Cloudflare Worker runtime has automatic deadlock
// prevention (in the form of auto-cancelling responses) that triggers when too
// many response bodies are unconsumed. This applies for error responses as
// well. As such, in this client we use this function to consume the response
// body whenever the request fails, even if we don't end up logging the body
// itself, to avoid hitting the deadlock prevention.
export async function failedResponseBody(response: Response): Promise<unknown> {
  try {
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  } catch (e) {
    return `Failed to extract response body: ${e}`
  }
}

function responseError(response: Response): string {
  return `${response.status} ${response.statusText}`
}

export type Snippet = {
  id: string
  code: string
  location: SnippetLocation
  liveEnabled: boolean
  builderEnabled: boolean
  cleanup: string | null
}

export type Font = { family: string; variants: string[] }

type Meta = {
  title?: string | null
  description?: string | null
  keywords?: string | null
  socialImage?: {
    id: string
    publicUrl: string
    mimetype: string
  } | null
  favicon?: {
    id: string
    publicUrl: string
    mimetype: string
  } | null
}
type Seo = {
  canonicalUrl?: string | null
  isIndexingBlocked?: boolean | null
}

type LocalizedPage = {
  id: string
  data: Element
  elementTreeId: string
  parentId: string | null
  meta: Omit<Meta, 'favicon'>
  seo: Seo
}

type MakeswiftConfig = {
  runtime: ReactRuntimeCore
}

export type Sitemap = {
  id: string
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
  alternateRefs?: {
    hreflang: string
    href: string
  }[]
}[]

const pagePathnameSlicesAPISchema = z.array(
  z
    .object({
      id: z.string(),
      basePageId: z.string(),
      pathname: z.string(),
      localizedPathname: z.string().optional(),
      __typename: z.literal('PagePathnameSlice'),
    })
    .nullable(),
)

const getPageAPISchema = z.object({
  pathname: z.string(),
  locale: z.string(),
  alternate: z.array(
    z.object({
      pathname: z.string(),
      locale: z.string(),
    }),
  ),
})

type GetPageAPI = z.infer<typeof getPageAPISchema>

const getFontsAPISchema = z.object({
  googleFonts: z.array(
    z.object({
      family: z.string(),
      variants: z.array(z.string()),
    }),
  ),
  siteId: z.string(),
})

export type GetFontsAPI = z.infer<typeof getFontsAPISchema>

export class MakeswiftClient {
  private graphqlClient: GraphQLClient
  private runtime: ReactRuntimeCore

  readonly apiKey: string

  constructor(apiKey: string, { runtime }: MakeswiftConfig) {
    if (typeof apiKey !== 'string') {
      throw new Error(
        'The Makeswift client must be passed a valid Makeswift site API key: ' +
          "`new Makeswift('<makeswift_site_api_key>')`\n" +
          `Received "${apiKey}" instead.`,
      )
    }

    this.apiKey = apiKey

    this.graphqlClient = new GraphQLClient(new URL('graphql', runtime.apiOrigin).href, {
      'makeswift-runtime-version': PACKAGE_VERSION,
    })
    this.runtime = runtime
  }

  get apiOrigin(): string {
    return this.runtime.apiOrigin
  }

  private async fetch(
    path: string,
    siteVersion: SiteVersion | null,
    init?: RequestInit,
  ): Promise<Response> {
    const requestUrl = new URL(path, this.apiOrigin)

    const requestHeaders = new Headers({
      'x-api-key': this.apiKey,
      'makeswift-site-api-key': this.apiKey,
      'makeswift-runtime-version': PACKAGE_VERSION,
    })

    if (siteVersion?.token) {
      requestUrl.searchParams.set('version', siteVersion.version)
      requestHeaders.set('makeswift-preview-token', siteVersion.token)
    }

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => {
        requestHeaders.set(key, value)
      })
    }

    const response = await fetch(requestUrl.toString(), {
      ...init,
      headers: requestHeaders,
      ...(siteVersion != null ? { cache: 'no-store' } : {}),
      ...this.fetchOptions(siteVersion),
    })

    return response
  }

  /**
   * Override this method to provide additional fetch options, e.g. revalidation, cache tags, etc.
   */
  fetchOptions(_siteVersion: SiteVersion | null): Record<string, unknown> {
    return {}
  }

  private getPagesInternal = async ({
    siteVersion = null,
    ...params
  }: {
    siteVersion?: SiteVersion | null
  } & GetPagesParams = {}): Promise<MakeswiftGetPagesResult> => {
    const queryParams = getPagesQueryParams(params)

    const response = await this.fetch(`v5/pages?${queryParams.toString()}`, siteVersion)
    if (!response.ok) {
      console.error('Failed to get pages', {
        response: await failedResponseBody(response),
        siteVersion,
        params,
      })

      throw new Error(`Failed to get pages: ${responseError(response)}`)
    }

    const result = await response.json()
    const parsedResponse = makeswiftGetPagesResultAPISchema.safeParse(result)
    if (!parsedResponse.success) {
      throw new Error(
        `Failed to parse 'getPages' response: ${parsedResponse.error.errors.map(e => e.message).join('; ')}`,
      )
    }
    return parsedResponse.data
  }

  getPages = toIterablePaginationResult(this.getPagesInternal)

  async getPage(
    pathname: string,
    { siteVersion = null, locale }: { siteVersion?: SiteVersion | null; locale?: string } = {},
  ): Promise<GetPageAPI | null> {
    const url = new URL(`v3/pages/${encodeURIComponent(pathname)}`, this.apiOrigin)
    if (locale) url.searchParams.set('locale', locale)

    const response = await this.fetch(url.pathname + url.search, siteVersion)

    if (!response.ok) {
      const failedBody = await failedResponseBody(response)
      if (response.status === 404) return null

      console.error(`Failed to get page snapshot for '${pathname}'`, {
        response: failedBody,
        siteVersion,
        locale,
      })

      throw new Error(`Failed to get page snapshot for '${pathname}': ${responseError(response)}`)
    }

    const json = await response.json()

    return getPageAPISchema.parse(json)
  }

  private async getTypographies(
    typographyIds: string[],
    siteVersion: SiteVersion | null,
  ): Promise<(Typography | null)[]> {
    if (typographyIds.length === 0) return []

    const url = new URL(`v3/typographies/bulk`, this.apiOrigin)

    typographyIds.forEach(id => {
      url.searchParams.append('ids', id)
    })

    const response = await this.fetch(url.pathname + url.search, siteVersion)

    if (!response.ok) {
      console.error(`Failed to get typographies for [${typographyIds.join(', ')}]`, {
        response: await failedResponseBody(response),
        siteVersion,
      })

      return []
    }

    const body = await response.json()

    return body
  }

  private async getSwatches(
    ids: string[],
    siteVersion: SiteVersion | null,
  ): Promise<(Swatch | null)[]> {
    if (ids.length === 0) return []

    const url = new URL(`v3/swatches/bulk`, this.apiOrigin)

    ids.forEach(id => {
      url.searchParams.append('ids', id)
    })

    const response = await this.fetch(url.pathname + url.search, siteVersion)

    if (!response.ok) {
      console.error(`Failed to get swatches for ${ids.join(', ')}`, {
        response: await failedResponseBody(response),
        siteVersion,
      })

      return []
    }

    return await response.json()
  }

  private async getElementTreesBulk(
    ids: string[],
    siteVersion: SiteVersion | null,
    locale?: string,
  ): Promise<(MakeswiftComponentDocument | null)[]> {
    if (ids.length === 0) return []

    const requestBody: { ids: string[]; locale?: string } = { ids }
    if (locale != null) requestBody.locale = locale

    const response = await this.fetch('v0/element-trees/bulk', siteVersion, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const failedBody = await failedResponseBody(response)

      console.error(`Failed to get element trees for [${ids.join(', ')}]`, {
        response: failedBody,
        siteVersion,
        locale,
      })

      throw new Error(`Failed to get element trees: ${responseError(response)}`)
    }

    const responseBody = await response.json()

    return responseBody.map((item: unknown) =>
      item != null ? makeswiftComponentDocumentSchema.parse(item) : null,
    )
  }

  private async getIntrospectedResources(
    {
      swatchIds,
      ...introspectedResourceIds
    }: IntrospectedResourcesQueryVariables & { swatchIds: string[] },
    siteVersion: SiteVersion | null,
  ): Promise<IntrospectedResourcesQueryResult & { swatches: (Swatch | null)[] }> {
    const result = await this.graphqlClient.request<
      IntrospectedResourcesQueryResult,
      IntrospectedResourcesQueryVariables
    >(IntrospectedResourcesQuery, introspectedResourceIds)
    const swatches = await this.getSwatches(swatchIds, siteVersion)

    return { ...result, swatches }
  }

  // TODO: Consolidate this method with the introspectMany method once the
  // unstable_getComponentSnapshots method is stable and tested in production.
  private async introspect(
    element: Element,
    siteVersion: SiteVersion | null,
    locale: string | null,
  ): Promise<CacheData> {
    const descriptors = this.getElementDescriptors()
    const swatchIds = new Set<string>()
    const fileIds = new Set<string>()
    const typographyIds = new Set<string>()
    const tableIds = new Set<string>()
    const pageIds = new Set<string>()
    const globalElements = new Map<string, GlobalElement | null>()
    const localizedGlobalElements = new Map<string, LocalizedGlobalElement | null>()
    const localizedResourcesMap = new Map<string, string | null>()

    const remaining = [element]
    const seen = new Set<string>()
    let current: Element | undefined

    while ((current = remaining.pop())) {
      let element: ElementData

      if (isElementReference(current)) {
        const globalElementId = current.value
        const globalElement = await this.getGlobalElement(globalElementId, siteVersion)
        let elementData = globalElement?.data

        if (locale) {
          const localizedGlobalElement = await this.getLocalizedGlobalElement(
            globalElementId,
            locale,
            siteVersion,
          )

          if (localizedGlobalElement) {
            // Update the logic here when we can merge element trees
            elementData = localizedGlobalElement.data

            localizedResourcesMap.set(globalElementId, localizedGlobalElement.id)
            localizedGlobalElements.set(localizedGlobalElement.id, localizedGlobalElement)
          } else {
            // Record that this localized global element doesn't exist so the
            // client won't try to fetch it again (which would result in a 404).
            localizedResourcesMap.set(globalElementId, null)
          }
        }

        globalElements.set(globalElementId, globalElement)

        if (elementData == null) continue

        element = elementData as ElementData
      } else {
        element = current
      }

      const elementDescriptors = descriptors.get(element.type)

      if (elementDescriptors == null) continue

      getResourcesFromElementDescriptors(elementDescriptors, element.props)

      function getResourcesFromElementDescriptors(
        elementDescriptors: Record<string, PropControllerDescriptor>,
        props: ElementData['props'],
      ) {
        Object.entries(elementDescriptors).forEach(([propName, descriptor]) => {
          getSwatchIds(descriptor, props[propName]).forEach(swatchId => {
            swatchIds.add(swatchId)
          })

          getFileIds(descriptor, props[propName]).forEach(fileId => fileIds.add(fileId))

          getTypographyIds(descriptor, props[propName]).forEach(typographyId =>
            typographyIds.add(typographyId),
          )

          getTableIds(descriptor, props[propName]).forEach(tableId => tableIds.add(tableId))

          getPageIds(descriptor, props[propName]).forEach(pageId => pageIds.add(pageId))

          getElementChildren(descriptor, props[propName]).forEach(child => {
            if (!seen.has(child.key)) {
              seen.add(child.key)

              remaining.push(child)
            }
          })
        })
      }
    }

    const typographies = await this.getTypographies([...typographyIds], siteVersion)

    typographies.forEach(typography => {
      typography?.style.forEach(style => {
        const swatchId = style.value.color?.swatchId

        if (swatchId != null) swatchIds.add(swatchId)
      })
    })

    const pagePathnames = await this.getPagePathnameSlices([...pageIds], siteVersion, { locale })

    const { swatches, files, tables } = await this.getIntrospectedResources(
      {
        swatchIds: [...swatchIds],
        fileIds: [...fileIds],
        tableIds: [...tableIds],
      },
      siteVersion,
    )

    const apiResources = {
      [APIResourceType.Swatch]: [...swatchIds].map(id => ({
        id,
        value: swatches.find(swatch => swatch?.id === id) ?? null,
      })),
      [APIResourceType.File]: [...fileIds].map(id => ({
        id,
        value: files.find(file => file?.id === id) ?? null,
      })),
      [APIResourceType.Typography]: [...typographyIds].map(id => ({
        id,
        value: typographies.find(typography => typography?.id === id) ?? null,
      })),
      [APIResourceType.Table]: [...tableIds].map(id => ({
        id,
        value: tables.find(table => table?.id === id) ?? null,
      })),
      [APIResourceType.PagePathnameSlice]: [...pageIds].map(id => ({
        id,
        value: pagePathnames.find(pagePathnameSlice => pagePathnameSlice?.id === id) ?? null,
        locale,
      })),
      [APIResourceType.GlobalElement]: [...globalElements.entries()].map(([id, value]) => ({
        id,
        value,
      })),
      [APIResourceType.LocalizedGlobalElement]: [...localizedGlobalElements.entries()].map(
        ([id, value]) => ({
          id,
          value,
          locale,
        }),
      ),
    }

    return {
      apiResources,
      localizedResourcesMap:
        locale != null ? { [locale]: Object.fromEntries(localizedResourcesMap.entries()) } : {},
    }
  }

  private async introspectMany(
    trees: { id: string; data: Element }[],
    siteVersion: SiteVersion | null,
    locale: string | null,
  ): Promise<Map<string, CacheData>> {
    if (trees.length === 0) return new Map()

    const descriptors = this.getElementDescriptors()

    // Shared caches for global elements (deduplication across trees)
    const globalElementCache = new Map<string, GlobalElement | null>()
    const localizedGlobalElementCache = new Map<string, LocalizedGlobalElement | null>()

    // Per-tree tracking, keyed by tree ID
    const treeCaches = new Map(
      trees.map(tree => [
        tree.id,
        {
          data: tree.data,
          swatchIds: new Set<string>(),
          fileIds: new Set<string>(),
          typographyIds: new Set<string>(),
          tableIds: new Set<string>(),
          pageIds: new Set<string>(),
          globalElements: new Map<string, GlobalElement | null>(),
          localizedGlobalElements: new Map<string, LocalizedGlobalElement | null>(),
          localizedResourcesMap: new Map<string, string | null>(),
        },
      ]),
    )

    // DFS traversal per tree
    for (const currentTreeCache of treeCaches.values()) {
      const remaining = [currentTreeCache.data]
      const seen = new Set<string>()
      let current: Element | undefined

      while ((current = remaining.pop())) {
        let element: ElementData

        if (isElementReference(current)) {
          const globalElementId = current.value

          // Fetch global element, using cache if already fetched for another tree
          let globalElement: GlobalElement | null
          if (globalElementCache.has(globalElementId)) {
            globalElement = globalElementCache.get(globalElementId)!
          } else {
            globalElement = await this.getGlobalElement(globalElementId, siteVersion)
            globalElementCache.set(globalElementId, globalElement)
          }

          let elementData = globalElement?.data

          if (locale) {
            let localizedGlobalElement: LocalizedGlobalElement | null
            if (localizedGlobalElementCache.has(globalElementId)) {
              localizedGlobalElement = localizedGlobalElementCache.get(globalElementId)!
            } else {
              localizedGlobalElement = await this.getLocalizedGlobalElement(
                globalElementId,
                locale,
                siteVersion,
              )
              localizedGlobalElementCache.set(globalElementId, localizedGlobalElement)
            }

            if (localizedGlobalElement) {
              // Update the logic here when we can merge element trees
              elementData = localizedGlobalElement.data

              currentTreeCache.localizedResourcesMap.set(globalElementId, localizedGlobalElement.id)
              currentTreeCache.localizedGlobalElements.set(
                localizedGlobalElement.id,
                localizedGlobalElement,
              )
            } else {
              // Record that this localized global element doesn't exist so the
              // client won't try to fetch it again (which would result in a 404).
              currentTreeCache.localizedResourcesMap.set(globalElementId, null)
            }
          }

          currentTreeCache.globalElements.set(globalElementId, globalElement)

          if (elementData == null) continue

          element = elementData as ElementData
        } else {
          element = current
        }

        const elementDescriptors = descriptors.get(element.type)

        if (elementDescriptors == null) continue

        getResourcesFromElementDescriptors(elementDescriptors, element.props)

        function getResourcesFromElementDescriptors(
          elementDescriptors: Record<string, PropControllerDescriptor>,
          props: ElementData['props'],
        ) {
          Object.entries(elementDescriptors).forEach(([propName, descriptor]) => {
            getSwatchIds(descriptor, props[propName]).forEach(swatchId => {
              currentTreeCache.swatchIds.add(swatchId)
            })

            getFileIds(descriptor, props[propName]).forEach(fileId => {
              currentTreeCache.fileIds.add(fileId)
            })

            getTypographyIds(descriptor, props[propName]).forEach(typographyId => {
              currentTreeCache.typographyIds.add(typographyId)
            })

            getTableIds(descriptor, props[propName]).forEach(tableId => {
              currentTreeCache.tableIds.add(tableId)
            })

            getPageIds(descriptor, props[propName]).forEach(pageId => {
              currentTreeCache.pageIds.add(pageId)
            })

            getElementChildren(descriptor, props[propName]).forEach(child => {
              if (!seen.has(child.key)) {
                seen.add(child.key)
                remaining.push(child)
              }
            })
          })
        }
      }
    }

    // Accumulate shared sets from per-tree state for bulk calls
    const allSwatchIds = new Set<string>()
    const allFileIds = new Set<string>()
    const allTypographyIds = new Set<string>()
    const allTableIds = new Set<string>()
    const allPageIds = new Set<string>()

    for (const currentTreeCache of treeCaches.values()) {
      currentTreeCache.swatchIds.forEach(id => allSwatchIds.add(id))
      currentTreeCache.fileIds.forEach(id => allFileIds.add(id))
      currentTreeCache.typographyIds.forEach(id => allTypographyIds.add(id))
      currentTreeCache.tableIds.forEach(id => allTableIds.add(id))
      currentTreeCache.pageIds.forEach(id => allPageIds.add(id))
    }

    // One combined round of bulk sub-resource calls

    // 1. Fetch typographies first (needed for secondary swatch discovery)
    const typographies = await this.getTypographies([...allTypographyIds], siteVersion)

    // 2. Secondary discovery: check for additional swatch IDs in typography styles
    typographies.forEach(typography => {
      if (typography == null) return

      const secondarySwatchIds: string[] = []
      typography.style.forEach(style => {
        const swatchId = style.value.color?.swatchId
        if (swatchId != null) {
          secondarySwatchIds.push(swatchId)
          allSwatchIds.add(swatchId)
        }
      })

      if (secondarySwatchIds.length > 0) {
        // Add discovered swatches to per-tree sets for trees that reference this typography
        for (const currentTreeCache of treeCaches.values()) {
          if (currentTreeCache.typographyIds.has(typography.id)) {
            secondarySwatchIds.forEach(id => currentTreeCache.swatchIds.add(id))
          }
        }
      }
    })

    // 3. Fetch remaining resources in parallel
    const [pagePathnames, { swatches, files, tables }] = await Promise.all([
      this.getPagePathnameSlices([...allPageIds], siteVersion, { locale }),
      this.getIntrospectedResources(
        {
          swatchIds: [...allSwatchIds],
          fileIds: [...allFileIds],
          tableIds: [...allTableIds],
        },
        siteVersion,
      ),
    ])

    // Build per-tree CacheData using only the resources that tree references
    const result = new Map<string, CacheData>()

    for (const [treeId, currentTreeCache] of treeCaches) {
      const apiResources = {
        [APIResourceType.Swatch]: [...currentTreeCache.swatchIds].map(id => ({
          id,
          value: swatches.find(swatch => swatch?.id === id) ?? null,
        })),
        [APIResourceType.File]: [...currentTreeCache.fileIds].map(id => ({
          id,
          value: files.find(file => file?.id === id) ?? null,
        })),
        [APIResourceType.Typography]: [...currentTreeCache.typographyIds].map(id => ({
          id,
          value: typographies.find(typography => typography?.id === id) ?? null,
        })),
        [APIResourceType.Table]: [...currentTreeCache.tableIds].map(id => ({
          id,
          value: tables.find(table => table?.id === id) ?? null,
        })),
        [APIResourceType.PagePathnameSlice]: [...currentTreeCache.pageIds].map(id => ({
          id,
          value: pagePathnames.find(pagePathnameSlice => pagePathnameSlice?.id === id) ?? null,
          locale,
        })),
        [APIResourceType.GlobalElement]: [...currentTreeCache.globalElements.entries()].map(
          ([id, value]) => ({
            id,
            value,
          }),
        ),
        [APIResourceType.LocalizedGlobalElement]: [
          ...currentTreeCache.localizedGlobalElements.entries(),
        ].map(([id, value]) => ({
          id,
          value,
          locale,
        })),
      }

      result.set(treeId, {
        apiResources,
        localizedResourcesMap:
          locale != null
            ? { [locale]: Object.fromEntries(currentTreeCache.localizedResourcesMap.entries()) }
            : {},
      })
    }

    return result
  }

  async getPageSnapshot(
    pathname: string,
    {
      siteVersion: siteVersionPromise,
      locale,
      allowLocaleFallback = true,
    }: {
      siteVersion: SiteVersion | null | Promise<SiteVersion | null>
      locale?: string
      allowLocaleFallback?: boolean
    },
  ): Promise<MakeswiftPageSnapshot | null> {
    const queryParams = (): string => {
      const params = new URLSearchParams()
      if (locale) params.set('locale', locale)
      if (allowLocaleFallback != null) params.set('allowLocaleFallback', `${allowLocaleFallback}`)
      return params.toString()
    }

    const siteVersion = await siteVersionPromise
    const response = await this.fetch(
      `v4/pages/${encodeURIComponent(pathname)}/document?${queryParams()}`,
      siteVersion,
    )

    if (!response.ok) {
      const failedBody = await failedResponseBody(response)
      if (response.status === 404) return null

      console.error(`Failed to get page snapshot for '${pathname}'`, {
        response: failedBody,
        siteVersion,
        locale,
      })

      throw new Error(`Failed to get page snapshot for '${pathname}': ${responseError(response)}`)
    }

    const document: MakeswiftPageDocument = await response.json()
    const baseLocalizedPage = document.localizedPages.find(({ parentId }) => parentId == null)

    const cacheData = await this.introspect(
      baseLocalizedPage?.data ?? document.data,
      siteVersion,
      // The /v3/pages endpoint returns null for document.locale when the requested locale is the default.
      // This legacy behavior is set to change with the upcoming /v4/pages endpoint.
      // We rely on document.locale when reading from the API cache, so ensure the cache is built during
      // introspection using the same value.
      document.locale,
    )

    return {
      document,
      cacheData,
    }
  }

  async getComponentSnapshot(
    id: string,
    {
      siteVersion: siteVersionPromise,
      locale,
      allowLocaleFallback = true,
    }: {
      siteVersion: SiteVersion | null | Promise<SiteVersion | null>
      locale?: string
      allowLocaleFallback?: boolean
    },
  ): Promise<MakeswiftComponentSnapshot> {
    const searchParams = new URLSearchParams()
    if (locale) searchParams.set('locale', locale)

    const siteVersion = await siteVersionPromise
    const key = deterministicUUID({ id, locale, seed: this.apiKey.split('-').at(0) })
    const baseLocaleWasRequested = locale == null
    const canAttemptLocaleFallback = !baseLocaleWasRequested && allowLocaleFallback

    let response
    const responseForRequestedLocale = await this.fetch(
      `v2/element-trees/${encodeURIComponent(id)}?${searchParams.toString()}`,
      siteVersion,
    )

    if (responseForRequestedLocale.status === 404 && canAttemptLocaleFallback) {
      await failedResponseBody(responseForRequestedLocale)
      response = await this.fetch(`v2/element-trees/${encodeURIComponent(id)}`, siteVersion)
    } else {
      response = responseForRequestedLocale
    }

    if (!response.ok) {
      // See comment on `failedResponseBody` for why we always consume the
      // response body of failed responses.
      const failedBody = await failedResponseBody(response)
      if (response.status === 404) {
        return {
          document: {
            id,
            locale: locale ?? null,
            data: null,
          },
          key,
          cacheData: CacheData.empty(),
          meta: {
            allowLocaleFallback,
            requestedLocale: locale ?? null,
          },
        }
      }

      console.error(`Failed to get component snapshot for '${id}':`, {
        response: failedBody,
        siteVersion,
        locale,
      })

      throw new Error(`Failed to get component snapshot for '${id}': ${responseError(response)}`)
    }

    const document = makeswiftComponentDocumentSchema.parse(await response.json())
    const cacheData = await this.introspect(document.data, siteVersion, locale ?? null)

    return {
      document,
      cacheData,
      key,
      meta: {
        allowLocaleFallback,
        requestedLocale: locale ?? null,
      },
    }
  }

  /**
   * Fetches multiple component snapshots in a single bulk request with unified introspection.
   *
   * @param ids - Element tree IDs to fetch. Maximum 100 IDs per call.
   */
  // TODO: Make getComponentSnapshot use this method under the hood once the v0 bulk endpoint is stable.
  async unstable_getComponentSnapshots(
    ids: string[],
    {
      siteVersion: siteVersionPromise,
      locale,
      allowLocaleFallback = true,
    }: {
      siteVersion: SiteVersion | null | Promise<SiteVersion | null>
      locale?: string
      allowLocaleFallback?: boolean
    },
  ): Promise<MakeswiftComponentSnapshot[]> {
    if (ids.length === 0) return []
    const siteVersion = await siteVersionPromise

    // Step 1: Bulk fetch
    let documents = await this.getElementTreesBulk(ids, siteVersion, locale)

    // Step 2: Locale fallback — second-pass for IDs that returned null
    const baseLocaleWasRequested = locale == null
    const canAttemptLocaleFallback = !baseLocaleWasRequested && allowLocaleFallback
    const fallbackIndices: number[] = []

    if (canAttemptLocaleFallback) {
      documents.forEach((doc, i) => {
        if (doc == null) fallbackIndices.push(i)
      })

      if (fallbackIndices.length > 0) {
        const fallbackIds = fallbackIndices.map(i => ids[i])
        const fallbackDocuments = await this.getElementTreesBulk(fallbackIds, siteVersion)

        fallbackIndices.forEach((originalIndex, fallbackIndex) => {
          documents[originalIndex] = fallbackDocuments[fallbackIndex]
        })
      }
    }

    // Step 3: Unified introspection for all trees that have data
    const treesToIntrospect = documents
      .map(doc => (doc?.data != null ? { id: doc.id, data: doc.data } : null))
      .filter(isNonNullable)

    const cacheDataMap = await this.introspectMany(treesToIntrospect, siteVersion, locale ?? null)

    // Step 4: Build per-component results
    return ids.map((id, i) => {
      const document = documents[i]
      const key = deterministicUUID({ id, locale, seed: this.apiKey.split('-').at(0) })

      if (document == null || document.data == null) {
        return {
          document: { id, locale: locale ?? null, data: null },
          key,
          cacheData: CacheData.empty(),
          meta: { allowLocaleFallback, requestedLocale: locale ?? null },
        }
      }

      return {
        document,
        key,
        cacheData: cacheDataMap.get(id) ?? CacheData.empty(),
        meta: { allowLocaleFallback, requestedLocale: locale ?? null },
      }
    })
  }

  async getSwatch(swatchId: string, siteVersion: SiteVersion | null): Promise<Swatch | null> {
    const response = await this.fetch(`v3/swatches/${swatchId}`, siteVersion)

    if (!response.ok) {
      const failedBody = await failedResponseBody(response)
      if (response.status !== 404) {
        console.error(`Failed to get swatch '${swatchId}'`, {
          response: failedBody,
          siteVersion,
        })
      }

      return null
    }

    const swatch = await response.json()

    return swatch
  }

  async getFile(fileId: string): Promise<File | null> {
    const result = await this.graphqlClient.request<FileQueryResult, FileQueryVariables>(
      FileQuery,
      { fileId },
    )

    return result.file
  }

  async getTypography(
    typographyId: string,
    siteVersion: SiteVersion | null,
  ): Promise<Typography | null> {
    const response = await this.fetch(`v3/typographies/${typographyId}`, siteVersion)

    if (!response.ok) {
      const failedBody = await failedResponseBody(response)
      if (response.status !== 404) {
        console.error(`Failed to get typography '${typographyId}'`, {
          response: failedBody,
          siteVersion,
        })
      }

      return null
    }

    const typography = await response.json()

    return typography
  }

  async getGlobalElement(
    globalElementId: string,
    siteVersion: SiteVersion | null,
  ): Promise<GlobalElement | null> {
    const response = await this.fetch(`v3/global-elements/${globalElementId}`, siteVersion)

    if (!response.ok) {
      const failedBody = await failedResponseBody(response)
      if (response.status !== 404) {
        console.error(`Failed to get global element '${globalElementId}'`, {
          response: failedBody,
          siteVersion,
        })
      }

      return null
    }

    const globalElement = await response.json()

    return globalElement
  }

  async getLocalizedGlobalElement(
    globalElementId: string,
    locale: string,
    siteVersion: SiteVersion | null,
  ): Promise<LocalizedGlobalElement | null> {
    const response = await this.fetch(
      `v3/localized-global-elements/${globalElementId}?locale=${locale}`,
      siteVersion,
    )

    if (!response.ok) {
      const failedBody = await failedResponseBody(response)
      if (response.status !== 404) {
        console.error(`Failed to get localized global element '${globalElementId}'`, {
          response: failedBody,
          siteVersion,
          locale,
        })
      }

      return null
    }

    const localizedGlobalElement = await response.json()

    return localizedGlobalElement
  }

  async getPagePathnameSlices(
    pageIds: string[],
    siteVersion: SiteVersion | null,
    { locale }: { locale?: string | null },
  ): Promise<(PagePathnameSlice | null)[]> {
    if (pageIds.length === 0) return []

    const url = new URL(`v3/page-pathname-slices/bulk`, this.apiOrigin)

    pageIds.forEach(id => url.searchParams.append('ids', id))
    if (locale != null) url.searchParams.set('locale', locale)

    const response = await this.fetch(url.pathname + url.search, siteVersion)

    if (!response.ok) {
      console.error(`Failed to get page pathname slice(s) for ${pageIds.join(', ')}`, {
        response: await failedResponseBody(response),
        siteVersion,
        locale,
      })

      return []
    }

    const json = await response.json()

    const pagePathnameSlices = pagePathnameSlicesAPISchema.parse(json)

    // We're mapping the basePageId to be the id, because we're still using the GraphQL
    // fragment as our APIResource. The id on the APIResource needs to match the pageId
    // so that we can find the corresponding page pathname slice when we call getPagePathnameSlice(pageId).
    // TODO: Update this once we move away from the GraphQL fragments.
    return pagePathnameSlices.map(pagePathnameSlice => {
      if (pagePathnameSlice == null) return null

      return {
        ...pagePathnameSlice,
        id: pagePathnameSlice.basePageId,
        localizedPathname: pagePathnameSlice.localizedPathname ?? null,
      }
    })
  }

  async getPagePathnameSlice(
    pageId: string,
    siteVersion: SiteVersion | null,
    { locale }: { locale?: string } = {},
  ): Promise<PagePathnameSlice | null> {
    const pagePathnameSlices = await this.getPagePathnameSlices([pageId], siteVersion, { locale })

    return pagePathnameSlices.at(0) ?? null
  }

  async getTable(tableId: string): Promise<Table | null> {
    const result = await this.graphqlClient.request<TableQueryResult, TableQueryVariables>(
      TableQuery,
      { tableId },
    )

    return result.table
  }

  getTranslatableData(elementTree: ElementData): Record<string, Data> {
    return getTranslatableContent(this.getElementDescriptors(), elementTree)
  }

  mergeTranslatedData(elementTree: ElementData, translatedData: Record<string, Data>): Element {
    return mergeTranslatedContent(this.getElementDescriptors(), elementTree, translatedData)
  }

  async readPreviewToken(token: string): Promise<PreviewTokenPayload | null> {
    const response = await fetch(new URL('v1/preview-tokens/reads', this.apiOrigin).toString(), {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'makeswift-site-api-key': this.apiKey,
        'makeswift-runtime-version': PACKAGE_VERSION,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ token }),
      cache: 'no-store',
    })

    if (!response.ok) {
      const failedBody = await failedResponseBody(response)
      if (response.status === 401) {
        console.error(`Preview token is invalid or expired`, {
          response: failedBody,
        })
      } else if (response.status !== 404) {
        console.error(`Failed to verify preview token`, {
          response: failedBody,
        })
      }

      return null
    }

    const json = await response.json()

    const parsed = previewTokenPayloadSchema.safeParse(json)
    if (!parsed.success) {
      throw new Error(
        `Failed to parse preview token payload: ${parsed.error.errors.map(e => e.message).join('; ')}`,
      )
    }

    return parsed.data
  }

  async unstable_getFonts(siteVersion: SiteVersion | null = null): Promise<GetFontsAPI | null> {
    const response = await this.fetch('v1_unstable/fonts', siteVersion)

    if (!response.ok) {
      console.error('Failed to fetch fonts', {
        response: await failedResponseBody(response),
        siteVersion,
      })

      return null
    }

    const json = await response.json()

    const parsed = getFontsAPISchema.safeParse(json)
    if (!parsed.success) {
      console.error('Failed to parse fonts API response', {
        response: json,
        siteVersion,
      })

      return null
    }

    return parsed.data
  }

  private getElementDescriptors() {
    return getPropControllerDescriptors(this.runtime.protoStore.getState())
  }
}
