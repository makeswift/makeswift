import { PreviewData } from 'next'
import {
  APIResourceType,
  File,
  GlobalElement,
  PagePathnameSlice,
  Swatch,
  Table,
  Typography,
} from '../api'
import { GraphQLClient } from '../api/graphql/client'
import {
  FileQuery,
  GlobalElementQuery,
  IntrospectedResourcesQuery,
  PagePathnamesByIdQuery,
  TableQuery,
  TypographiesQuery,
  TypographyQuery,
} from '../api/graphql/documents'
import {
  FileQueryResult,
  FileQueryVariables,
  GlobalElementQueryResult,
  GlobalElementQueryVariables,
  IntrospectedResourcesQueryResult,
  IntrospectedResourcesQueryVariables,
  PagePathnamesByIdQueryResult,
  PagePathnamesByIdQueryVariables,
  TableQueryResult,
  TableQueryVariables,
  TypographiesQueryResult,
  TypographiesQueryVariables,
  TypographyQueryResult,
  TypographyQueryVariables,
} from '../api/graphql/generated/types'
import { CacheData } from '../api/react'
import { ListControlData, ListControlType, ShapeControlData, ShapeControlType } from '../controls'
import { PropControllerDescriptor } from '../prop-controllers'
import { ListValue, ShapeValue, Types } from '../prop-controllers/descriptors'
import {
  getElementChildren,
  getElementSwatchIds,
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
}

export type MakeswiftPageSnapshot = {
  document: MakeswiftPageDocument
  apiOrigin: string
  cacheData: CacheData
  preview: boolean
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

type MakeswiftConfig = {
  apiOrigin?: string
  runtime?: ReactRuntime
  unstable_previewData?: PreviewData
}

export class Makeswift {
  private apiKey: string
  private apiOrigin: URL
  private graphqlClient: GraphQLClient
  private runtime: ReactRuntime
  private siteVersion: MakeswiftSiteVersion | null

  constructor(
    apiKey: string,
    {
      apiOrigin = 'https://api.makeswift.com',
      runtime = ReactRuntime,
      unstable_previewData,
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
    this.siteVersion = getMakeswiftSiteVersion(unstable_previewData)
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
    const response = await this.fetch(`/v2/pages`, {
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

  private async getTypographies(typographyIds: string[]): Promise<(Typography | null)[]> {
    const result = await this.graphqlClient.request<
      TypographiesQueryResult,
      TypographiesQueryVariables
    >(TypographiesQuery, { typographyIds })

    return result.typographies
  }

  private async getSwatches(ids: string[], preview: boolean): Promise<(Swatch | null)[]> {
    const url = new URL(`v1/swatches/bulk`, this.apiOrigin)

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

  private async introspect(element: Element, preview: boolean): Promise<CacheData> {
    const runtime = this.runtime
    const descriptors = getPropControllerDescriptors(runtime.store.getState())
    const swatchIds = new Set<string>()
    const fileIds = new Set<string>()
    const typographyIds = new Set<string>()
    const tableIds = new Set<string>()
    const pageIds = new Set<string>()
    const globalElements = new Map<string, GlobalElement | null>()

    const remaining = [element]
    const seen = new Set<string>()
    let current: Element | undefined

    while ((current = remaining.pop())) {
      let element: ElementData

      if (isElementReference(current)) {
        const globalElement = await this.getGlobalElement(current.value)

        globalElements.set(current.value, globalElement)

        const elementData = globalElement?.data

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
          getElementSwatchIds(descriptor, props[propName]).forEach(swatchId => {
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

          if (descriptor.type === ShapeControlType) {
            const prop = props[propName] as ShapeControlData

            if (prop == null) return

            getResourcesFromElementDescriptors(descriptor.config.type, prop)
          }

          if (descriptor.type === ListControlType) {
            const prop = props[propName] as ListControlData

            if (prop == null) return

            prop.forEach(item => {
              getResourcesFromElementDescriptors(
                { propName: descriptor.config.type },
                { propName: item.value },
              )
            })
          }

          if (descriptor.type === Types.Shape) {
            const prop = props[propName] as ShapeValue

            if (prop == null) return

            getResourcesFromElementDescriptors(descriptor.options.type, prop)
          }

          if (descriptor.type === Types.List) {
            const prop = props[propName] as ListValue

            if (prop == null) return

            prop.forEach(item => {
              getResourcesFromElementDescriptors(
                { propName: descriptor.options.type },
                { propName: item.value },
              )
            })
          }
        })
      }
    }

    const typographies = await this.getTypographies([...typographyIds])

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

    return {
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
    }
  }

  async getPageSnapshot(
    pathname: string,
    { preview: previewOverride = false }: { preview?: boolean } = {},
  ): Promise<MakeswiftPageSnapshot | null> {
    const siteVersion =
      this.siteVersion ??
      (previewOverride ? MakeswiftSiteVersion.Working : MakeswiftSiteVersion.Live)
    const response = await this.fetch(`/v2/pages/${pathname}/document`, {
      headers: { 'Makeswift-Site-Version': siteVersion },
    })

    if (!response.ok) {
      if (response.status === 404) return null

      console.error('Failed to get page snapshot', await response.json())
      throw new Error(`Failed to get page snapshot with error: "${response.statusText}"`)
    }

    const document = await response.json()
    const cacheData = await this.introspect(document.data, previewOverride)
    const apiOrigin = this.apiOrigin.href
    const preview = siteVersion === MakeswiftSiteVersion.Working

    return { document, cacheData, apiOrigin, preview }
  }

  async getSwatch(swatchId: string): Promise<Swatch | null> {
    const response = await this.fetch(`v1/swatches/${swatchId}`)

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
    const result = await this.graphqlClient.request<
      TypographyQueryResult,
      TypographyQueryVariables
    >(TypographyQuery, { typographyId })

    return result.typography
  }

  async getGlobalElement(globalElementId: string): Promise<GlobalElement | null> {
    const result = await this.graphqlClient.request<
      GlobalElementQueryResult,
      GlobalElementQueryVariables
    >(GlobalElementQuery, { globalElementId })

    return result.globalElement
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
}
