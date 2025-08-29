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
import { type SiteVersion } from '../api/site-version'
import { toIterablePaginationResult } from '../utils/pagination'
import { deterministicUUID } from '../utils/deterministic-uuid'
import { Schema } from '@makeswift/controls'
import { EMBEDDED_DOCUMENT_TYPE, EmbeddedDocument } from '../state/modules/read-only-documents'
import { Base64 } from 'js-base64'
import { MAKESWIFT_GLOBAL_CACHE_TAG, MAKESWIFT_PAGE_METADATA_CHANGED_CACHE_TAG, MAKESWIFT_RESOURCE_CHANGED_CACHE_TAG } from '../next/cache'

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

// TODO move
// this is a copy of what we use for unstructured introspection in the builder
function isAPIResourceType(val: string): val is APIResourceType {
  return APIResourceType[val as keyof typeof APIResourceType] != null
}
// TODO move
// this is a copy of what we use for unstructured introspection in the builder
const parseResourceIdSchema = z.string().transform((val, ctx) => {
  try {
    const match = Base64.decode(val).match(/^([^:]+):(.+)$/)
    if (!match) throw new TypeError(`NodeID cannot represent value: ${String(val)}`)
    const [, typeName, key] = match
    if (isAPIResourceType(typeName)) {
      return { key, typeName }
    }
    throw new TypeError(`decoded type '${typeName}' is not a valid APIResourceType`)
  } catch (error) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${String(val)} is not a valid node resource ID`,
    })
    return z.NEVER
  }
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

export type MakeswiftConfig = {
  apiOrigin?: string
  runtime: ReactRuntime
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

// temporary slop for testing
function convertNodeIdsToCacheTags(resourceIds: string[]): string[] {
  const cacheTags: string[] = []
  for (const id of resourceIds) {
    const result = parseResourceIdSchema.safeParse(id)
    if (result.success) {
      cacheTags.push(result.data.key)
    } else {
      // TODO how do we want to handle?
    }
  }
  return cacheTags
}

export class MakeswiftClient {
  private graphqlClient: GraphQLClient
  private runtime: ReactRuntime

  readonly apiKey: string
  readonly apiOrigin: URL

  constructor(
    apiKey: string,
    { apiOrigin = 'https://api.makeswift.com', runtime }: MakeswiftConfig,
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

  private async fetch(path: string, siteVersion: SiteVersion | null, cacheTags?: string[]): Promise<Response> {
    const requestUrl = new URL(path, this.apiOrigin)

    const requestHeaders = new Headers({
      'X-API-Key': this.apiKey,
      'Makeswift-Site-API-Key': this.apiKey,
    })

    if (siteVersion?.token) {
      requestUrl.searchParams.set('version', siteVersion.version)
      requestHeaders.set('makeswift-preview-token', siteVersion.token)
    }

    console.log({ href: requestUrl.href, cacheTags})

    // Below: all fetch requests should be responsive to the global cache tag
    const cacheTagsWithGlobalTag = [...(cacheTags ?? []), MAKESWIFT_GLOBAL_CACHE_TAG]

    // TODO: a problem we'd need to address is that Nextjs only allows up to 120 tags per request fetch options?
    const response = await fetch(requestUrl.toString(), {
      headers: requestHeaders,
      ...(siteVersion != null ? { cache: 'no-store' } : {}),
      ...this.fetchOptions(siteVersion, cacheTagsWithGlobalTag),
    })

    return response
  }

  /**
   * Override this method to provide additional fetch options, e.g. revalidation, cache tags, etc.
   */
  fetchOptions(_siteVersion: SiteVersion | null, _cacheTags?: string[]): Record<string, unknown> {
    return {}
  }

  private getPagesInternal = async ({
    siteVersion = null,
    ...params
  }: {
    siteVersion?: SiteVersion | null
  } & GetPagesParams = {}): Promise<MakeswiftGetPagesResult> => {
    const queryParams = getPagesQueryParams(params)

    const response = await this.fetch(`v5/pages?${queryParams.toString()}`, siteVersion, [MAKESWIFT_PAGE_METADATA_CHANGED_CACHE_TAG])
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

    const cacheTags = [MAKESWIFT_RESOURCE_CHANGED_CACHE_TAG, pathname]
    const response = await this.fetch(url.pathname + url.search, siteVersion, cacheTags)

    if (!response.ok) {
      if (response.status === 404) return null

      console.error(`Failed to get page snapshot for '${pathname}'`, {
        response: await failedResponseBody(response),
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

    const cacheTags = convertNodeIdsToCacheTags(typographyIds)

    const response = await this.fetch(url.pathname + url.search, siteVersion, cacheTags)

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

    const cacheTags = convertNodeIdsToCacheTags(ids)

    const response = await this.fetch(url.pathname + url.search, siteVersion, cacheTags)

    if (!response.ok) {
      console.error(`Failed to get swatches for ${ids.join(', ')}`, {
        response: await failedResponseBody(response),
        siteVersion,
      })

      return []
    }

    return await response.json()
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

  private async introspect(
    element: Element,
    siteVersion: SiteVersion | null,
    locale: string | null,
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
      [MAKESWIFT_RESOURCE_CHANGED_CACHE_TAG, pathname]
    )

    if (!response.ok) {
      if (response.status === 404) return null

      console.error(`Failed to get page snapshot for '${pathname}'`, {
        response: await failedResponseBody(response),
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

    // TODO assembling element tree cache tag... Need site ID? 
    // TODO update cosmos element tree cache tag
    // const cacheTag = `${id}-${siteVersion.}`

    let response
    const responseForRequestedLocale = await this.fetch(
      `v2/element-trees/${encodeURIComponent(id)}?${searchParams.toString()}`,
      siteVersion,
      [MAKESWIFT_GLOBAL_CACHE_TAG]
    )

    if (responseForRequestedLocale.status === 404 && canAttemptLocaleFallback) {
      response = await this.fetch(`v2/element-trees/${encodeURIComponent(id)}`, siteVersion)
    } else {
      response = responseForRequestedLocale
    }

    if (!response.ok) {
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
        response: await failedResponseBody(response),
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

  async getSwatch(swatchId: string, siteVersion: SiteVersion | null): Promise<Swatch | null> {
    const cacheTags = convertNodeIdsToCacheTags([swatchId])
    const response = await this.fetch(`v3/swatches/${swatchId}`, siteVersion, cacheTags)

    if (!response.ok) {
      if (response.status !== 404) {
        console.error(`Failed to get swatch '${swatchId}'`, {
          response: await failedResponseBody(response),
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
    const cacheTags = convertNodeIdsToCacheTags([typographyId])

    const response = await this.fetch(`v3/typographies/${typographyId}`, siteVersion, cacheTags)

    if (!response.ok) {
      if (response.status !== 404) {
        console.error(`Failed to get typography '${typographyId}'`, {
          response: await failedResponseBody(response),
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
    const cacheTags = convertNodeIdsToCacheTags([globalElementId])
    const response = await this.fetch(`v3/global-elements/${globalElementId}`, siteVersion, cacheTags)

    if (!response.ok) {
      if (response.status !== 404) {
        console.error(`Failed to get global element '${globalElementId}'`, {
          response: await failedResponseBody(response),
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
    const cacheTags = convertNodeIdsToCacheTags([globalElementId])
    const response = await this.fetch(
      `v3/localized-global-elements/${globalElementId}?locale=${locale}`,
      siteVersion,
      cacheTags
    )

    if (!response.ok) {
      if (response.status !== 404) {
        console.error(`Failed to get localized global element '${globalElementId}'`, {
          response: await failedResponseBody(response),
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

    const cacheTags = convertNodeIdsToCacheTags(pageIds)
    pageIds.forEach(id => url.searchParams.append('ids', id))
    if (locale != null) url.searchParams.set('locale', locale)

    const response = await this.fetch(url.pathname + url.search, siteVersion, cacheTags)

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
    return this.runtime.getTranslatableData(elementTree)
  }

  mergeTranslatedData(elementTree: ElementData, translatedData: Record<string, Data>): Element {
    return this.runtime.mergeTranslatedData(elementTree, translatedData)
  }

  async readPreviewToken(token: string): Promise<PreviewTokenPayload | null> {
    const response = await fetch(new URL('v1/preview-tokens/reads', this.apiOrigin).toString(), {
      method: 'POST',
      headers: {
        ['X-API-Key']: this.apiKey,
        'Makeswift-Site-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
      cache: 'no-store',
    })

    if (!response.ok) {
      if (response.status === 401) {
        console.error(`Preview token is invalid or expired`, {
          response: await failedResponseBody(response),
        })
      } else if (response.status !== 404) {
        console.error(`Failed to verify preview token`, {
          response: await failedResponseBody(response),
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
}
