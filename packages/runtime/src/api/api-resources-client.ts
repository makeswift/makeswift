import { type FetchableValue } from '@makeswift/controls'

import { type Store as ApiClientStore } from '../state/api-client/store'
import * as ApiClientState from '../state/api-client/state'

import {
  type File,
  type GlobalElement,
  type LocalizedGlobalElement,
  type Page,
  type PagePathnameSlice,
  type Site,
  type Snippet,
  type Swatch,
  type Table,
  type Typography,
  APIResourceType,
} from './types'

export type CacheData = ApiClientState.SerializedState

export const CacheData = {
  empty(): CacheData {
    return {
      apiResources: {},
      localizedResourcesMap: {},
    }
  },
}

export abstract class ApiResourcesClient {
  readonly store: ApiClientStore
  readonly subscribe: ApiClientStore['subscribe']

  constructor({ store }: { store: ApiClientStore }) {
    this.store = store
    this.subscribe = this.store.subscribe
  }

  abstract fetchSwatch(swatchId: string): Promise<Swatch | null>

  readSwatch(swatchId: string): Swatch | null {
    return ApiClientState.getAPIResource(this.store.getState(), APIResourceType.Swatch, swatchId)
  }

  resolveSwatch(swatchId: string | undefined): FetchableValue<Swatch | null> {
    return this.resolveResource(APIResourceType.Swatch, {
      id: swatchId,
      read: id => this.readSwatch(id),
      fetch: id => this.fetchSwatch(id),
    })
  }

  abstract fetchFile(fileId: string): Promise<File | null>

  readFile(fileId: string): File | null {
    return ApiClientState.getAPIResource(this.store.getState(), APIResourceType.File, fileId)
  }

  resolveFile(fileId: string | undefined): FetchableValue<File | null> {
    return this.resolveResource(APIResourceType.File, {
      id: fileId,
      read: id => this.readFile(id),
      fetch: id => this.fetchFile(id),
    })
  }

  abstract fetchTypography(typographyId: string): Promise<Typography | null>

  readTypography(typographyId: string): Typography | null {
    return ApiClientState.getAPIResource(
      this.store.getState(),
      APIResourceType.Typography,
      typographyId,
    )
  }

  resolveTypography(typographyId: string | undefined): FetchableValue<Typography | null> {
    return this.resolveResource(APIResourceType.Typography, {
      id: typographyId,
      read: id => this.readTypography(id),
      fetch: id => this.fetchTypography(id),
    })
  }

  abstract fetchGlobalElement(globalElementId: string): Promise<GlobalElement | null>

  readGlobalElement(globalElementId: string): GlobalElement | null {
    return ApiClientState.getAPIResource(
      this.store.getState(),
      APIResourceType.GlobalElement,
      globalElementId,
    )
  }

  abstract fetchLocalizedGlobalElement({
    globalElementId,
    locale,
  }: {
    globalElementId: string
    locale: string
  }): Promise<LocalizedGlobalElement | null>

  readLocalizedGlobalElement({
    globalElementId,
    locale,
  }: {
    globalElementId: string
    locale: string
  }): LocalizedGlobalElement | null {
    return ApiClientState.getAPIResource(
      this.store.getState(),
      APIResourceType.LocalizedGlobalElement,
      globalElementId,
      locale,
    )
  }

  readPagePathnameSlice({
    pageId,
    locale,
  }: {
    pageId: string
    locale: string | null
  }): PagePathnameSlice | null {
    return ApiClientState.getAPIResource(
      this.store.getState(),
      APIResourceType.PagePathnameSlice,
      pageId,
      locale,
    )
  }

  abstract fetchPagePathnameSlice({
    pageId,
    locale,
  }: {
    pageId: string
    locale: string | null
  }): Promise<PagePathnameSlice | null>

  resolvePagePathnameSlice({
    pageId,
    locale,
  }: {
    pageId: string | undefined
    locale: string | null
  }): FetchableValue<PagePathnameSlice | null> {
    return this.resolveResource(APIResourceType.PagePathnameSlice, {
      id: pageId,
      read: id => this.readPagePathnameSlice({ pageId: id, locale }),
      fetch: id => this.fetchPagePathnameSlice({ pageId: id, locale }),
    })
  }

  resolveResource<R>(
    type: APIResourceType,
    {
      id,
      read,
      fetch,
    }: {
      id: string | undefined
      read: (id: string) => R | null
      fetch: (id: string) => Promise<R | null>
    },
  ): FetchableValue<R | null> {
    const _read = () => (id != null ? read(id) : null)
    let lastValue: R | null = null
    return {
      name: `${type}:${id}`,
      readStable: () => (lastValue = _read()),
      subscribe: (onUpdate: () => void) =>
        this.subscribe(() => {
          if (_read() !== lastValue) onUpdate()
        }),
      fetch: async () => (id != null ? fetch(id) : null),
    }
  }

  abstract fetchTable(tableId: string): Promise<Table | null>

  readTable(tableId: string): Table | null {
    return ApiClientState.getAPIResource(this.store.getState(), APIResourceType.Table, tableId)
  }

  readSite(siteId: string): Site | null {
    return ApiClientState.getAPIResource(this.store.getState(), APIResourceType.Site, siteId)
  }

  readPage(pageId: string): Page | null {
    return ApiClientState.getAPIResource(this.store.getState(), APIResourceType.Page, pageId)
  }

  readSnippet(snippetId: string): Snippet | null {
    return ApiClientState.getAPIResource(this.store.getState(), APIResourceType.Snippet, snippetId)
  }
}
