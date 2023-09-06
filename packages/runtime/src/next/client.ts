import { PreviewData } from 'next'
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
import {
  FileQuery,
  IntrospectedResourcesQuery,
  PagePathnamesByIdQuery,
  TableQuery,
} from '../api/graphql/documents'
import {
  FileQueryResult,
  FileQueryVariables,
  IntrospectedResourcesQueryResult,
  IntrospectedResourcesQueryVariables,
  PagePathnamesByIdQueryResult,
  PagePathnamesByIdQueryVariables,
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
  siteVersion?: MakeswiftSiteVersion
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

export class Makeswift {
  private apiKey: string
  private apiOrigin: URL
  private graphqlClient: GraphQLClient
  private runtime: ReactRuntime
  private siteVersion: MakeswiftSiteVersion | null

  static getSiteVersion(previewData: PreviewData): MakeswiftSiteVersion {
    return getMakeswiftSiteVersion(previewData) ?? MakeswiftSiteVersion.Live
  }

  constructor(
    apiKey: string,
    {
      apiOrigin = 'https://api.makeswift.com',
      runtime = ReactRuntime,
      siteVersion,
    }: MakeswiftConfig = {},
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
    this.siteVersion = siteVersion ?? null
  }

  private async fetch(path: string, init?: RequestInit): Promise<Response> {
    const response = await fetch(new URL(path, this.apiOrigin).toString(), {
      ...init,
      headers: {
        ['X-API-Key']: this.apiKey,
        'Makeswift-Site-API-Key': this.apiKey,
        'Makeswift-Site-Version': this.siteVersion ?? MakeswiftSiteVersion.Live,
        ...init?.headers,
      },
    })

    return response
  }

  async getPages(): Promise<MakeswiftPage[]> {
    const response = await this.fetch(`/${this.siteVersion == null ? 'v2' : 'v3'}/pages`, {
      headers: {
        'Makeswift-Site-Version': MakeswiftSiteVersion.Live,
      },
    })

    if (!response.ok) {
      console.error('Failed to get pages', await response.json())
      throw new Error(`Failed to get pages with error: "${response.statusText}"`)
    }

    const json = await response.json()

    return json
  }

  private async getTypographies(
    typographyIds: string[],
    preview: boolean,
  ): Promise<(Typography | null)[]> {
    const url = new URL(
      `${this.siteVersion == null ? 'v1' : 'v2'}/typographies/bulk`,
      this.apiOrigin,
    )

    typographyIds.forEach(id => {
      url.searchParams.append('ids', id)
    })

    const response = await this.fetch(url.pathname + url.search, {
      headers: {
        'Makeswift-Site-Version':
          this.siteVersion ?? (preview ? MakeswiftSiteVersion.Working : MakeswiftSiteVersion.Live),
      },
    })

    if (!response.ok) {
      console.error('Failed to get typographies', await response.json())

      return []
    }

    const body = await response.json()

    return body
  }

  private async getSwatches(ids: string[], preview: boolean): Promise<(Swatch | null)[]> {
    const url = new URL(`${this.siteVersion == null ? 'v1' : 'v2'}/swatches/bulk`, this.apiOrigin)

    ids.forEach(id => {
      url.searchParams.append('ids', id)
    })

    const response = await this.fetch(url.pathname + url.search, {
      headers: {
        'Makeswift-Site-Version':
          this.siteVersion ?? (preview ? MakeswiftSiteVersion.Working : MakeswiftSiteVersion.Live),
      },
    })

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
    preview: boolean,
  ): Promise<IntrospectedResourcesQueryResult & { swatches: (Swatch | null)[] }> {
    const result = await this.graphqlClient.request<
      IntrospectedResourcesQueryResult,
      IntrospectedResourcesQueryVariables
    >(IntrospectedResourcesQuery, introspectedResourceIds)
    const swatches = await this.getSwatches(swatchIds, preview)

    return { ...result, swatches }
  }

  private async introspect(
    element: Element,
    preview: boolean,
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
        const globalElement = await this.getGlobalElement(globalElementId)
        let elementData = globalElement?.data

        if (locale) {
          const localizedGlobalElement = await this.getLocalizedGlobalElement(
            globalElementId,
            locale,
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

    const typographies = await this.getTypographies([...typographyIds], preview)

    typographies.forEach(typography => {
      typography?.style.forEach(style => {
        const swatchId = style.value.color?.swatchId

        if (swatchId != null) swatchIds.add(swatchId)
      })
    })

    const { swatches, files, tables, pagePathnamesById } = await this.getIntrospectedResources(
      {
        swatchIds: [...swatchIds],
        fileIds: [...fileIds],
        tableIds: [...tableIds],
        pageIds: [...pageIds],
      },
      preview,
    )

    // We're doing this because the API return the id without turning it to nodeId:
    // '87237bda-e775-48d8-92cc-399c65577bb7' vs 'UGFnZTo4NzIzN2JkYS1lNzc1LTQ4ZDgtOTJjYy0zOTljNjU1NzdiYjc='
    const pagePathnameSlices = pagePathnamesById.map(
      pagePathnameSlice =>
        pagePathnameSlice && {
          ...pagePathnameSlice,
          id: Buffer.from(`Page:${pagePathnameSlice.id}`).toString('base64'),
        },
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
        value: pagePathnameSlices.find(pagePathnameSlice => pagePathnameSlice?.id === id) ?? null,
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
    {
      preview: previewOverride = false,
      locale: localeInput,
    }: { preview?: boolean; locale?: string } = {},
  ): Promise<MakeswiftPageSnapshot | null> {
    const siteVersion =
      this.siteVersion ??
      (previewOverride ? MakeswiftSiteVersion.Working : MakeswiftSiteVersion.Live)

    const searchParams = new URLSearchParams()
    if (localeInput) {
      searchParams.set('locale', localeInput)
    }

    const response = await this.fetch(
      `/${this.siteVersion == null ? 'v2' : 'v3'}/pages/${encodeURIComponent(
        pathname,
      )}/document?${searchParams.toString()}`,
      {
        headers: { 'Makeswift-Site-Version': siteVersion },
      },
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
      previewOverride,
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

  async getSwatch(swatchId: string): Promise<Swatch | null> {
    const response = await this.fetch(
      `${this.siteVersion == null ? 'v1' : 'v2'}/swatches/${swatchId}`,
    )

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

  async getTypography(typographyId: string): Promise<Typography | null> {
    const response = await this.fetch(
      `${this.siteVersion == null ? 'v1' : 'v2'}/typographies/${typographyId}`,
    )

    if (!response.ok) {
      if (response.status !== 404) console.error('Failed to get typography', await response.json())

      return null
    }

    const typography = await response.json()

    return typography
  }

  async getGlobalElement(globalElementId: string): Promise<GlobalElement | null> {
    const response = await this.fetch(
      `${this.siteVersion == null ? 'v1' : 'v2'}/global-elements/${globalElementId}`,
    )

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
  ): Promise<LocalizedGlobalElement | null> {
    const response = await this.fetch(
      `${
        this.siteVersion == null ? 'v1' : 'v2'
      }/localized-global-elements/${globalElementId}?locale=${locale}`,
    )

    if (!response.ok) {
      if (response.status !== 404)
        console.error('Failed to get localized global element', await response.json())

      return null
    }

    const localizedGlobalElement = await response.json()

    return localizedGlobalElement
  }

  async getPagePathnameSlice(pageId: string): Promise<PagePathnameSlice | null> {
    const result = await this.graphqlClient.request<
      PagePathnamesByIdQueryResult,
      PagePathnamesByIdQueryVariables
    >(PagePathnamesByIdQuery, { pageIds: [pageId] })

    return result.pagePathnamesById.at(0) ?? null
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
}
