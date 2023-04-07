import { File, GlobalElement, PagePathnameSlice, Swatch, Table, Typography } from '../api'
import { GraphQLClient } from '../api/graphql/client'
import {
  FileQuery,
  GlobalElementQuery,
  PagePathnamesByIdQuery,
  SwatchQuery,
  TableQuery,
  TypographyQuery,
} from '../api/graphql/documents'
import {
  FileQueryResult,
  FileQueryVariables,
  GlobalElementQueryResult,
  GlobalElementQueryVariables,
  PagePathnamesByIdQueryResult,
  PagePathnamesByIdQueryVariables,
  SwatchQueryResult,
  SwatchQueryVariables,
  TableQueryResult,
  TableQueryVariables,
  TypographyQueryResult,
  TypographyQueryVariables,
} from '../api/graphql/generated/types'
import { CacheData, MakeswiftClient } from '../api/react'
import { Element } from '../state/react-page'

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
}

export class Makeswift {
  private apiKey: string
  private apiOrigin: URL
  private graphqlClient: GraphQLClient

  constructor(apiKey: string, { apiOrigin = 'https://api.makeswift.com' }: MakeswiftConfig = {}) {
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
  }

  private async fetch(path: string, init?: RequestInit): Promise<Response> {
    const response = await fetch(new URL(path, this.apiOrigin).toString(), {
      ...init,
      headers: { ...init?.headers, ['X-API-Key']: this.apiKey },
    })

    return response
  }

  async getPages(params: { path?: string } = {}): Promise<MakeswiftPage[]> {
    const searchParams = new URLSearchParams(params)
    const response = await this.fetch(`/v1/pages?${searchParams}`)

    if (!response.ok) {
      throw new Error(`Failed to get pages with error: "${response.statusText}"`)
    }

    const json = await response.json()

    return json
  }

  private async createSnapshot(
    document: MakeswiftPageDocument,
    preview: boolean,
  ): Promise<MakeswiftPageSnapshot> {
    const client = new MakeswiftClient({ uri: new URL('graphql', this.apiOrigin).href })
    const cacheData = await client.prefetch(document.data)

    return { document, apiOrigin: this.apiOrigin.href, cacheData, preview }
  }

  private async getPageSnapshotByPageId(
    pageId: string,
    { preview = false }: { preview?: boolean } = {},
  ): Promise<MakeswiftPageSnapshot | null> {
    const searchParams = new URLSearchParams({ preview: String(preview) })
    const response = await this.fetch(`/v1/pages/${pageId}/document?${searchParams}`)

    if (!response.ok) {
      if (response.status === 404) return null

      throw new Error(`Failed to get snapshot with error: "${response.statusText}"`)
    }

    const document: MakeswiftPageDocument = await response.json()

    return await this.createSnapshot(document, preview)
  }

  async getPageSnapshot(
    path: string,
    { preview }: { preview?: boolean } = {},
  ): Promise<MakeswiftPageSnapshot | null> {
    const [page] = await this.getPages({ path })

    if (page == null) return null

    const snapshot = this.getPageSnapshotByPageId(page.id, { preview })

    return snapshot
  }

  async getSwatch(swatchId: string): Promise<Swatch | null> {
    const result = await this.graphqlClient.request<SwatchQueryResult, SwatchQueryVariables>(
      SwatchQuery,
      { swatchId },
    )

    return result.swatch
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
