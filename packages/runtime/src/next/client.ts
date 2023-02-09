import { version as runtimeVersion } from '../../package.json'
import { APIResource } from '../api'
import { CacheData, MakeswiftClient } from '../api/react'
import { Element } from '../state/react-page'

export type MakeswiftPage = {
  id: string
  path: string
}

// @note: open to whatever name
export type MakeswiftPageData = {
  pageId: string
  siteId: string
  snapshot: unstable_Snapshot
  options: { preview: boolean; apiOrigin: string }
}

export type MakeswiftPageDocument = {
  id: string
  site: { id: string }
  data: Element
} & NonElementTreeResources

export type MakeswiftPageSnapshot = {
  document: MakeswiftPageDocument
  apiOrigin: string
  cacheData: CacheData
  preview: boolean
}

type ElementTreeResources = CacheData

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
type NonElementTreeResources = {
  snippets: Snippet[]
  fonts: Font[]
  meta: Meta
  seo: Seo
}
export type MakeswiftResources = ElementTreeResources & NonElementTreeResources

export type unstable_Snapshot = {
  resources: MakeswiftResources
  elementTree: Element
  runtimeVersion: string
}

type MakeswiftConfig = {
  apiOrigin?: string
}

export class Makeswift {
  private apiKey: string
  private apiOrigin: URL

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

  async unstable_getPageData(
    path: string,
    { preview }: { preview?: boolean } = {},
  ): Promise<MakeswiftPageData | null> {
    const [page] = await this.getPages({ path })

    if (page == null) return null

    const document = await this.getDocumentForPage(page.id)
    const snapshot = await this.unstable_createSnapshotForPage({ document, pageId: page.id })

    return {
      pageId: page.id,
      siteId: document.site.id,
      snapshot,
      options: { preview: preview || false, apiOrigin: this.apiOrigin.href },
    }
  }

  private async getDocumentForPage(pageId: string): Promise<MakeswiftPageDocument> {
    const response = await this.fetch(`/v1/pages/${pageId}/document?preview=false`)

    if (!response.ok) {
      if (response.status === 404) throw Error('bad')

      throw new Error(`Failed to create snapshot with error: "${response.statusText}"`)
    }

    const document: MakeswiftPageDocument = await response.json()

    return document
  }

  async unstable_createSnapshotForPage({
    document,
    pageId,
  }: {
    document?: MakeswiftPageDocument
    pageId: string
  }): Promise<unstable_Snapshot> {
    let fetchedDocument = document

    if (fetchedDocument == null) {
      const response = await this.fetch(`/v1/pages/${pageId}/document?preview=false`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Not found')
        }

        throw new Error(`Failed to create snapshot with error: "${response.statusText}"`)
      }

      fetchedDocument = await response.json()
    }

    if (fetchedDocument == null) {
      throw Error('fetchedDocument should never be null')
    }

    const client = new MakeswiftClient({ uri: new URL('graphql', this.apiOrigin).href })
    const prefetchedResources = await client.prefetch(fetchedDocument.data)

    // @todo: Make the format of all the resources even more consistent
    const resources = {
      ...prefetchedResources,
      snippets: fetchedDocument.snippets,
      meta: fetchedDocument.meta,
      seo: fetchedDocument.seo,
      fonts: fetchedDocument.fonts,
    }

    return { resources, elementTree: fetchedDocument.data, runtimeVersion }
  }

  async unstable_createSnapshot({
    publishedResources,
    deletedResources,
    publishedElementTree,
    currentSnapshot,
  }: {
    publishedResources?: Partial<MakeswiftResources>
    deletedResources?: Partial<MakeswiftResources>
    publishedElementTree?: Element
    currentSnapshot?: unstable_Snapshot
  }): Promise<unstable_Snapshot> {
    const client = new MakeswiftClient({ uri: new URL('graphql', this.apiOrigin).href })

    function normalizeToMakeswiftResources(
      partialResources?: Partial<MakeswiftResources>,
    ): MakeswiftResources {
      const resources: MakeswiftResources = {
        Swatch: partialResources?.Swatch || [],
        File: partialResources?.File || [],
        Typography: partialResources?.Typography || [],
        PagePathnameSlice: partialResources?.PagePathnameSlice || [],
        GlobalElement: partialResources?.GlobalElement || [],
        Table: partialResources?.Table || [],
        Snippet: partialResources?.Snippet || [],
        Page: partialResources?.Page || [],
        Site: partialResources?.Site || [],
        snippets: partialResources?.snippets || [],
        fonts: partialResources?.fonts || [],
        meta: partialResources?.meta || {},
        seo: partialResources?.seo || {},
      }
      return resources
    }

    function mergeResources({
      resourcesFromPublishedElementTree,
      resourcesFromCurrentSnapshot,
      publishedResources,
      deletedResources,
    }: {
      resourcesFromPublishedElementTree: MakeswiftResources
      resourcesFromCurrentSnapshot: MakeswiftResources
      publishedResources: MakeswiftResources
      deletedResources: MakeswiftResources
    }) {
      // chooses the last set value per id
      function mergeElementTreeResource(
        resourceSet: { id: string; value: APIResource }[],
        deletedResources: { id: string; value: APIResource }[],
      ): { id: string; value: APIResource }[] {
        const map = new Map(
          resourceSet.map(({ id, value }) => [id, value] as [string, APIResource]),
        )

        deletedResources.forEach(({ id }) => map.delete(id))

        const finalResourceSet: { id: string; value: any }[] = []
        Array.from(map.entries()).forEach(([id, value]) => {
          if (value != null) {
            finalResourceSet.push({ id, value })
          }
        })

        return finalResourceSet
      }
      // return an array of unique snippets, where uniqueness
      // is determined by id
      function mergeSnippets(snippets: Snippet[], deletedSnippet: Snippet[]): Snippet[] {
        const map = new Map(snippets.map(value => [value.id, value]))

        deletedSnippet.forEach(({ id }) => map.delete(id))

        const uniqueSnippets: Snippet[] = []
        Array.from(map.entries()).forEach(([_, value]) => {
          uniqueSnippets.push(value)
        })

        return uniqueSnippets
      }

      function mergeFonts(fonts: Font[], deletedFonts: Font[]): Font[] {
        const map = new Map(fonts.map(value => [value.family, value]))

        deletedFonts.forEach(({ family }) => map.delete(family))

        const uniqueFonts: Font[] = []
        Array.from(map.entries()).forEach(([_, value]) => {
          uniqueFonts.push(value)
        })

        return uniqueFonts
      }
      const resources: MakeswiftResources = {
        Swatch: mergeElementTreeResource(
          [
            ...resourcesFromPublishedElementTree.Swatch,
            ...resourcesFromCurrentSnapshot.Swatch,
            ...publishedResources.Swatch,
          ],
          deletedResources.Swatch,
        ),
        File: mergeElementTreeResource(
          [
            ...resourcesFromPublishedElementTree.File,
            ...resourcesFromCurrentSnapshot.File,
            ...publishedResources.File,
          ],
          deletedResources.File,
        ),
        Typography: mergeElementTreeResource(
          [
            ...resourcesFromPublishedElementTree.Typography,
            ...resourcesFromCurrentSnapshot.Typography,
            ...publishedResources.Typography,
          ],
          deletedResources.Typography,
        ),
        PagePathnameSlice: mergeElementTreeResource(
          [
            ...resourcesFromPublishedElementTree.PagePathnameSlice,
            ...resourcesFromCurrentSnapshot.PagePathnameSlice,
            ...publishedResources.PagePathnameSlice,
          ],
          deletedResources.PagePathnameSlice,
        ),
        GlobalElement: mergeElementTreeResource(
          [
            ...resourcesFromPublishedElementTree.GlobalElement,
            ...resourcesFromCurrentSnapshot.GlobalElement,
            ...publishedResources.GlobalElement,
          ],
          deletedResources.GlobalElement,
        ),
        Table: mergeElementTreeResource(
          [
            ...resourcesFromPublishedElementTree.Table,
            ...resourcesFromCurrentSnapshot.Table,
            ...publishedResources.Table,
          ],
          deletedResources.Table,
        ),
        snippets: mergeSnippets(
          [
            ...resourcesFromCurrentSnapshot.snippets,
            ...resourcesFromPublishedElementTree.snippets,
            ...publishedResources.snippets,
          ],
          deletedResources.snippets,
        ),
        fonts: mergeFonts(
          [
            ...resourcesFromCurrentSnapshot.fonts,
            ...resourcesFromPublishedElementTree.fonts,
            ...publishedResources.fonts,
          ],
          deletedResources.fonts,
        ),
        meta: {
          ...resourcesFromCurrentSnapshot.meta,
          ...publishedResources.meta,
        },
        seo: { ...resourcesFromCurrentSnapshot.seo, ...publishedResources.seo },

        // included resources just for type consistency
        Snippet: [],
        Page: [],
        Site: [],
      }

      return resources
    }

    const resourcesFromPublishedElementTree =
      publishedElementTree != null
        ? normalizeToMakeswiftResources(await client.prefetch(publishedElementTree))
        : normalizeToMakeswiftResources({})
    const resourcesFromCurrentSnapshot = normalizeToMakeswiftResources(
      currentSnapshot?.resources || {},
    )
    const resources = mergeResources({
      resourcesFromPublishedElementTree,
      resourcesFromCurrentSnapshot,
      publishedResources: normalizeToMakeswiftResources(publishedResources),
      deletedResources: normalizeToMakeswiftResources(deletedResources),
    })

    const elementTree = publishedElementTree || currentSnapshot?.elementTree
    if (elementTree == null) {
      throw Error('elementTree should not be null; something went wrong.')
    }

    return {
      resources,
      elementTree,
      runtimeVersion,
    }
  }

  unstable_getSnapshotResourceMapping(snapshot: unstable_Snapshot): string[] {
    const resources = snapshot.resources

    function parseResourceIds({ id }: { id: string }): string {
      return id
    }

    return [
      ...resources.Swatch.map(parseResourceIds),
      ...resources.File.map(parseResourceIds),
      ...resources.Typography.map(parseResourceIds),
      ...resources.PagePathnameSlice.map(parseResourceIds),
      ...resources.GlobalElement.map(parseResourceIds),
      ...resources.Table.map(parseResourceIds),
      ...resources.snippets.map(parseResourceIds),
    ]
  }
}
