import { PreviewData } from 'next'
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
  TableQueryResult,
  TableQueryVariables,
} from '../api/graphql/generated/types'

import { CacheData } from '../api/react'
import { Descriptor as PropControllerDescriptor } from '../prop-controllers/descriptors'
import {
  getElementChildren,
  getSwatchIds,
  getFileIds,
  getPageIds,
  getTableIds,
  getTypographyIds,
} from '../prop-controllers/introspection'
import { ReactRuntime } from '../runtimes/react'
import {
  type Element,
  type ElementData,
  type Data,
  type Document,
  getPropControllerDescriptors,
  isElementReference,
} from '../state/react-page'
import { getMakeswiftSiteVersion, MakeswiftSiteVersion } from './preview-mode'
import { toIterablePaginationResult } from './utils/pagination'
import { deterministicUUID } from '../utils/deterministic-uuid'
import { Schema } from '@makeswift/controls'
import { EMBEDDED_DOCUMENT_TYPE, EmbeddedDocument } from '../state/modules/read-only-documents'
import { MAKESWIFT_CACHE_TAG } from './api-handler/handlers/webhook/site-published'

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
  limit = 20,
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

export type MakeswiftComponentSnapshotConfig = {
  allowLocaleFallback: boolean
  requestedLocale: string | null
}

export type MakeswiftComponentSnapshot = {
  document: MakeswiftComponentDocument | MakeswiftComponentDocumentFallback
  key: string
  cacheData: CacheData
  config: MakeswiftComponentSnapshotConfig
}

export function componentDocumentToRootEmbeddedDocument({
  document,
  documentKey,
  name,
  type,
  config,
}: {
  document: MakeswiftComponentDocument | MakeswiftComponentDocumentFallback
  documentKey: string
  name: string
  type: string
  config: MakeswiftComponentSnapshotConfig
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
    config,
    __type: EMBEDDED_DOCUMENT_TYPE,
  }

  return rootDocument
}

type Snippet = {
  id: string
  code: string
  location: 'HEAD' | 'BODY'
  liveEnabled: boolean
  builderEnabled: boolean
  cleanup: string | null
}
type Font = { family: string; variants: string[] }

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
  apiOrigin?: string
  runtime?: ReactRuntime
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

export class Makeswift {
  private apiKey: string
  private apiOrigin: URL
  private graphqlClient: GraphQLClient
  private runtime: ReactRuntime

  static getSiteVersion(previewData: PreviewData): MakeswiftSiteVersion {
    return getMakeswiftSiteVersion(previewData) ?? MakeswiftSiteVersion.Live
  }

  static getPreviewMode(previewData: PreviewData): boolean {
    return getMakeswiftSiteVersion(previewData) === MakeswiftSiteVersion.Working
  }

  constructor(
    apiKey: string,
    { apiOrigin = 'https://api.makeswift.com', runtime = ReactRuntime }: MakeswiftConfig = {},
  ) {
    if (typeof apiKey !== 'string') {
      throw new Error(
        'The Makeswift client must be passed a valid Makeswift site API key: ' +
          "`new Makeswift('<makeswift_site_api_key>')`\n" +
          `Received "${apiKey}" instead.`,
      )
    }

    this.apiKey = apiKey

    try {
      this.apiOrigin = new URL(apiOrigin)
    } catch {
      throw new Error(
        `The Makeswift client received an invalid \`apiOrigin\` parameter: "${apiOrigin}".`,
      )
    }

    this.graphqlClient = new GraphQLClient(new URL('graphql', apiOrigin).href)
    this.runtime = runtime
  }

  private async fetch(
    path: string,
    siteVersion: MakeswiftSiteVersion = MakeswiftSiteVersion.Live,
    init?: RequestInit,
  ): Promise<Response> {
    const response = await fetch(new URL(path, this.apiOrigin).toString(), {
      ...init,
      headers: {
        ['X-API-Key']: this.apiKey,
        'Makeswift-Site-API-Key': this.apiKey,
        'Makeswift-Site-Version': siteVersion,
        ...init?.headers,
      },
      ...(siteVersion === MakeswiftSiteVersion.Working ? { cache: 'no-store' } : {}),
      next: {
        ...init?.next,
        tags: [...(init?.next?.tags ?? []), MAKESWIFT_CACHE_TAG],
      },
    })

    return response
  }

  private getPagesInternal = async ({
    siteVersion = MakeswiftSiteVersion.Live,
    ...params
  }: {
    siteVersion?: MakeswiftSiteVersion
  } & GetPagesParams = {}): Promise<MakeswiftGetPagesResult> => {
    const queryParams = getPagesQueryParams(params)

    const response = await this.fetch(`v4/pages?${queryParams.toString()}`, siteVersion)
    if (!response.ok) {
      console.error('Failed to get pages', await response.json())
      throw new Error(`Failed to get pages with error: "${response.statusText}"`)
    }

    const result = await response.json()
    const parsedResponse = makeswiftGetPagesResultAPISchema.safeParse(result)
    if (!parsedResponse.success) {
      throw new Error(
        `Failed to parse getPages response: ${parsedResponse.error.errors.join(', ')}`,
      )
    }
    return parsedResponse.data
  }

  getPages = toIterablePaginationResult(this.getPagesInternal)

  async getPage(
    pathname: string,
    {
      siteVersion = MakeswiftSiteVersion.Live,
      locale: localeInput,
    }: { siteVersion?: MakeswiftSiteVersion; locale?: string } = {},
  ): Promise<GetPageAPI | null> {
    const url = new URL(`v2/pages/${encodeURIComponent(pathname)}`, this.apiOrigin)
    if (localeInput) url.searchParams.set('locale', localeInput)

    const response = await this.fetch(url.pathname + url.search, siteVersion)

    if (!response.ok) {
      if (response.status === 404) return null

      console.error('Failed to get page snapshot', await response.json())
      throw new Error(`Failed to get page snapshot with error: "${response.statusText}"`)
    }

    const json = await response.json()

    return getPageAPISchema.parse(json)
  }

  private async getTypographies(
    typographyIds: string[],
    siteVersion: MakeswiftSiteVersion,
  ): Promise<(Typography | null)[]> {
    if (typographyIds.length === 0) return []

    const url = new URL(`v2/typographies/bulk`, this.apiOrigin)

    typographyIds.forEach(id => {
      url.searchParams.append('ids', id)
    })

    const response = await this.fetch(url.pathname + url.search, siteVersion)

    if (!response.ok) {
      console.error('Failed to get typographies', await response.json())

      return []
    }

    const body = await response.json()

    return body
  }

  private async getSwatches(
    ids: string[],
    siteVersion: MakeswiftSiteVersion,
  ): Promise<(Swatch | null)[]> {
    if (ids.length === 0) return []

    const url = new URL(`v2/swatches/bulk`, this.apiOrigin)

    ids.forEach(id => {
      url.searchParams.append('ids', id)
    })

    const response = await this.fetch(url.pathname + url.search, siteVersion)

    if (!response.ok) {
      console.error('Failed to get swatches', await response.json())

      return []
    }

    return await response.json()
  }

  private async getIntrospectedResources(
    {
      swatchIds,
      ...introspectedResourceIds
    }: IntrospectedResourcesQueryVariables & { swatchIds: string[] },
    siteVersion: MakeswiftSiteVersion,
  ): Promise<IntrospectedResourcesQueryResult & { swatches: (Swatch | null)[] }> {
    const result = await this.graphqlClient.request<
      IntrospectedResourcesQueryResult,
      IntrospectedResourcesQueryVariables
    >(IntrospectedResourcesQuery, introspectedResourceIds)
    const swatches = await this.getSwatches(swatchIds, siteVersion)

    return { ...result, swatches }
  }

  private async introspect(
    element: Element,
    siteVersion: MakeswiftSiteVersion,
    locale?: string,
  ): Promise<CacheData> {
    const runtime = this.runtime
    const descriptors = getPropControllerDescriptors(runtime.store.getState())
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

  async getPageSnapshot(
    pathname: string,
    {
      siteVersion: siteVersionPromise,
      locale: localeInput,
    }: { siteVersion: MakeswiftSiteVersion | Promise<MakeswiftSiteVersion>; locale?: string },
  ): Promise<MakeswiftPageSnapshot | null> {
    const searchParams = new URLSearchParams()
    if (localeInput) {
      searchParams.set('locale', localeInput)
    }

    const siteVersion = await siteVersionPromise
    const response = await this.fetch(
      `v3/pages/${encodeURIComponent(pathname)}/document?${searchParams.toString()}`,
      siteVersion,
    )

    if (!response.ok) {
      if (response.status === 404) return null

      console.error('Failed to get page snapshot', await response.json())
      throw new Error(`Failed to get page snapshot with error: "${response.statusText}"`)
    }

    const document: MakeswiftPageDocument = await response.json()
    const baseLocalizedPage = document.localizedPages.find(({ parentId }) => parentId == null)

    const cacheData = await this.introspect(
      baseLocalizedPage?.data ?? document.data,
      siteVersion,
      localeInput,
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
      siteVersion: MakeswiftSiteVersion | Promise<MakeswiftSiteVersion>
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
      `v1/element-trees/${id}?${searchParams.toString()}`,
      siteVersion,
    )

    if (responseForRequestedLocale.status === 404 && canAttemptLocaleFallback) {
      response = await this.fetch(`v1/element-trees/${id}`, siteVersion)
    } else {
      response = responseForRequestedLocale
    }

    if (response.status === 404) {
      return {
        document: {
          id,
          locale: locale ?? null,
          data: null,
        },
        key,
        cacheData: CacheData.empty(),
        config: {
          allowLocaleFallback,
          requestedLocale: locale ?? null,
        },
      }
    }

    const json = await response.json()
    if (!response.ok) {
      console.error('Failed to get page snapshot', json)
      throw new Error(`Failed to get page snapshot with error: "${response.statusText}"`)
    }

    const document = makeswiftComponentDocumentSchema.parse(json)
    const cacheData = await this.introspect(document.data, siteVersion, locale)

    return {
      document,
      cacheData,
      key,
      config: {
        allowLocaleFallback,
        requestedLocale: locale ?? null,
      },
    }
  }

  async getSwatch(swatchId: string, siteVersion: MakeswiftSiteVersion): Promise<Swatch | null> {
    const response = await this.fetch(`v2/swatches/${swatchId}`, siteVersion)

    if (!response.ok) {
      if (response.status !== 404) console.error('Failed to get swatch', await response.json())

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
    siteVersion: MakeswiftSiteVersion,
  ): Promise<Typography | null> {
    const response = await this.fetch(`v2/typographies/${typographyId}`, siteVersion)

    if (!response.ok) {
      if (response.status !== 404) console.error('Failed to get typography', await response.json())

      return null
    }

    const typography = await response.json()

    return typography
  }

  async getGlobalElement(
    globalElementId: string,
    siteVersion: MakeswiftSiteVersion,
  ): Promise<GlobalElement | null> {
    const response = await this.fetch(`v2/global-elements/${globalElementId}`, siteVersion)

    if (!response.ok) {
      if (response.status !== 404)
        console.error('Failed to get global element', await response.json())

      return null
    }

    const globalElement = await response.json()

    return globalElement
  }

  async getLocalizedGlobalElement(
    globalElementId: string,
    locale: string,
    siteVersion: MakeswiftSiteVersion,
  ): Promise<LocalizedGlobalElement | null> {
    const response = await this.fetch(
      `v2/localized-global-elements/${globalElementId}?locale=${locale}`,
      siteVersion,
    )

    if (!response.ok) {
      if (response.status !== 404)
        console.error('Failed to get localized global element', await response.json())

      return null
    }

    const localizedGlobalElement = await response.json()

    return localizedGlobalElement
  }

  async getPagePathnameSlices(
    pageIds: string[],
    siteVersion: MakeswiftSiteVersion,
    { locale }: { locale?: string },
  ): Promise<(PagePathnameSlice | null)[]> {
    if (pageIds.length === 0) return []

    const url = new URL(`v2/page-pathname-slices/bulk`, this.apiOrigin)

    pageIds.forEach(id => url.searchParams.append('ids', id))
    if (locale != null) url.searchParams.set('locale', locale)

    const response = await this.fetch(url.pathname + url.search, siteVersion)

    if (!response.ok) {
      console.error('Failed to get page pathname slices', await response.json())

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
    siteVersion: MakeswiftSiteVersion,
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

  /**
   * @deprecated `getSitemap` is deprecated. We recommend constructing a sitemap
   * using data from `getPages` instead.
   */
  async getSitemap({
    limit = 50,
    after,
    pathnamePrefix,
    locale,
  }: {
    limit?: number
    after?: string
    pathnamePrefix?: string
    locale?: string
  } = {}): Promise<Sitemap> {
    const url = new URL('v1/sitemap', this.apiOrigin)

    url.searchParams.set('limit', limit.toString())
    if (after != null) url.searchParams.set('after', after)
    if (pathnamePrefix != null) url.searchParams.set('pathnamePrefix', pathnamePrefix)
    if (locale != null) url.searchParams.set('locale', locale)

    const response = await this.fetch(url.pathname + url.search)

    if (!response.ok) {
      console.error('Failed to get sitemap', await response.json())
      throw new Error(`Failed to get sitemap with error: "${response.statusText}"`)
    }

    const sitemap = await response.json()

    return sitemap
  }

  getTranslatableData(elementTree: ElementData): Record<string, Data> {
    return this.runtime.getTranslatableData(elementTree)
  }

  mergeTranslatedData(elementTree: ElementData, translatedData: Record<string, Data>): Element {
    return this.runtime.mergeTranslatedData(elementTree, translatedData)
  }
}
