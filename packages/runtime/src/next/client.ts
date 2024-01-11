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
import { CacheData, SerializedLocalizedResourcesMap } from '../api/react'
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
  Element,
  ElementData,
  getPropControllerDescriptors,
  isElementReference,
  Data,
} from '../state/react-page'
import { getMakeswiftSiteVersion, MakeswiftSiteVersion } from './preview-mode'

export type MakeswiftPage = {
  id: string
  path: string
}

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

export type MakeswiftPageSnapshot = {
  document: MakeswiftPageDocument
  apiOrigin: string
  cacheData: CacheData
  preview: boolean
  localizedResourcesMap: SerializedLocalizedResourcesMap
  locale: string | null
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
    })

    return response
  }

  async getPages({
    siteVersion = MakeswiftSiteVersion.Live,
  }: {
    siteVersion?: MakeswiftSiteVersion
  } = {}): Promise<MakeswiftPage[]> {
    const response = await this.fetch(`v3/pages`, siteVersion)

    if (!response.ok) {
      console.error('Failed to get pages', await response.json())
      throw new Error(`Failed to get pages with error: "${response.statusText}"`)
    }

    const json = await response.json()

    return json
  }

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
  ): Promise<{ cacheData: CacheData; localizedResourcesMap: SerializedLocalizedResourcesMap }> {
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

          localizedResourcesMap.set(globalElementId, localizedGlobalElement?.id ?? null)

          if (localizedGlobalElement) {
            // Update the logic here when we can merge element trees
            elementData = localizedGlobalElement.data

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

    const cacheData = {
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
      })),
      [APIResourceType.GlobalElement]: [...globalElements.entries()].map(([id, value]) => ({
        id,
        value,
      })),
      [APIResourceType.LocalizedGlobalElement]: [...localizedGlobalElements.entries()].map(
        ([id, value]) => ({
          id,
          value,
        }),
      ),
    }

    return { cacheData, localizedResourcesMap: Object.fromEntries(localizedResourcesMap.entries()) }
  }

  async getPageSnapshot(
    pathname: string,
    { siteVersion, locale: localeInput }: { siteVersion: MakeswiftSiteVersion; locale?: string },
  ): Promise<MakeswiftPageSnapshot | null> {
    const searchParams = new URLSearchParams()
    if (localeInput) {
      searchParams.set('locale', localeInput)
    }

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
    // We're using the locale from the response instead from the arg because in the server
    // we make the locale null if the locale === defaultLocale.
    const locale = document.locale

    const { cacheData, localizedResourcesMap } = await this.introspect(
      baseLocalizedPage?.data ?? document.data,
      siteVersion,
      locale ?? undefined,
    )
    const apiOrigin = this.apiOrigin.href
    const preview = siteVersion === MakeswiftSiteVersion.Working

    return {
      document,
      cacheData,
      apiOrigin,
      preview,
      localizedResourcesMap,
      locale,
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
        id: pagePathnameSlice.basePageId,
        pathname: pagePathnameSlice.pathname,
        __typename: pagePathnameSlice.__typename,
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
