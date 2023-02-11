import { version as runtimeVersion } from '../../package.json'
import { APIResource } from '../api'
import { CacheData, MakeswiftClient } from '../api/react'
import { getSnapshotResourcesFromSerializedState } from '../state/modules/api-resources'
import { Element } from '../state/react-page'
import { MakeswiftSnapshotResources, normalizeToMakeswiftResources } from './snapshots'

export type MakeswiftPage = {
  id: string
  path: string
}

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

export type unstable_Snapshot = {
  resources: MakeswiftSnapshotResources
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
      if (response.status === 404) throw Error('Document not found.')

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

    // @ts-expect-error: this method is now broken. @fixme!
    return { resources, elementTree: fetchedDocument.data, runtimeVersion }
  }

  async unstable_createSnapshot({
    publishedResources,
    deletedResources,
    publishedElementTree,
    currentSnapshot,
  }: {
    publishedResources?: Partial<MakeswiftSnapshotResources>
    deletedResources?: {
      swatches: string[]
      typographies: string[]
      files: string[]
      pagePathnameSlices: string[]
      globalElements: string[]
      snippets: string[]
      fonts: []
    }
    publishedElementTree?: Element
    currentSnapshot?: unstable_Snapshot
  }): Promise<unstable_Snapshot> {
    const client = new MakeswiftClient({ uri: new URL('graphql', this.apiOrigin).href })

    function mergeResources({
      resourcesFromPublishedElementTree,
      resourcesFromCurrentSnapshot,
      publishedResources,
      deletedResources,
    }: {
      resourcesFromPublishedElementTree: MakeswiftSnapshotResources
      resourcesFromCurrentSnapshot: MakeswiftSnapshotResources
      publishedResources: MakeswiftSnapshotResources
      deletedResources?: {
        swatches: string[]
        typographies: string[]
        files: string[]
        pagePathnameSlices: string[]
        globalElements: string[]
        snippets: string[]
        fonts: []
      }
    }) {
      // chooses the last set value per id
      function mergeIdSpecifiedResource<T>(
        resourceSet: { id: string; value: T }[],
        deletedResources?: string[],
      ): { id: string; value: T }[] {
        const map = new Map(resourceSet.map(({ id, value }) => [id, value] as [string, T]))

        deletedResources?.forEach(id => map.delete(id))

        const finalResourceSet: { id: string; value: any }[] = []
        Array.from(map.entries()).forEach(([id, value]) => {
          if (value != null) {
            finalResourceSet.push({ id, value })
          }
        })

        return finalResourceSet
      }

      const resources: MakeswiftSnapshotResources = {
        swatches: mergeIdSpecifiedResource(
          [
            ...resourcesFromPublishedElementTree.swatches,
            ...resourcesFromCurrentSnapshot.swatches,
            ...publishedResources.swatches,
          ],
          deletedResources?.swatches,
        ),
        files: mergeIdSpecifiedResource(
          [
            ...resourcesFromPublishedElementTree.files,
            ...resourcesFromCurrentSnapshot.files,
            ...publishedResources.files,
          ],
          deletedResources?.files,
        ),
        typographies: mergeIdSpecifiedResource(
          [
            ...resourcesFromPublishedElementTree.typographies,
            ...resourcesFromCurrentSnapshot.typographies,
            ...publishedResources.typographies,
          ],
          deletedResources?.typographies,
        ),
        pagePathnameSlices: mergeIdSpecifiedResource(
          [
            ...resourcesFromPublishedElementTree.pagePathnameSlices,
            ...resourcesFromCurrentSnapshot.pagePathnameSlices,
            ...publishedResources.pagePathnameSlices,
          ],
          deletedResources?.pagePathnameSlices,
        ),
        globalElements: mergeIdSpecifiedResource(
          [
            ...resourcesFromPublishedElementTree.globalElements,
            ...resourcesFromCurrentSnapshot.globalElements,
            ...publishedResources.globalElements,
          ],
          deletedResources?.globalElements,
        ),
        snippets: mergeIdSpecifiedResource(
          [
            ...resourcesFromPublishedElementTree.snippets,
            ...resourcesFromCurrentSnapshot.snippets,
            ...publishedResources.snippets,
          ],
          deletedResources?.snippets,
        ),
        fonts: mergeIdSpecifiedResource(
          [
            ...resourcesFromPublishedElementTree.fonts,
            ...resourcesFromCurrentSnapshot.fonts,
            ...publishedResources.fonts,
          ],
          deletedResources?.fonts,
        ),
        pageMetadata: {
          ...resourcesFromCurrentSnapshot.pageMetadata,
          ...publishedResources.pageMetadata,
        },
        pageSeo: { ...resourcesFromCurrentSnapshot.pageSeo, ...publishedResources.pageSeo },
      }

      return resources
    }

    const resourcesFromPublishedElementTree =
      publishedElementTree != null
        ? normalizeToMakeswiftResources(
            getSnapshotResourcesFromSerializedState(await client.prefetch(publishedElementTree)),
          )
        : normalizeToMakeswiftResources({})
    const resourcesFromCurrentSnapshot = normalizeToMakeswiftResources(
      currentSnapshot?.resources || {},
    )
    const resources = mergeResources({
      resourcesFromPublishedElementTree,
      resourcesFromCurrentSnapshot,
      publishedResources: normalizeToMakeswiftResources(publishedResources),
      deletedResources,
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
      ...resources.swatches.map(parseResourceIds),
      ...resources.files.map(parseResourceIds),
      ...resources.typographies.map(parseResourceIds),
      ...resources.pagePathnameSlices.map(parseResourceIds),
      ...resources.globalElements.map(parseResourceIds),
      ...resources.snippets.map(parseResourceIds),
    ]
  }
}
