import { type FetchableValue } from '@makeswift/controls'

import { type Store as ApiClientStore } from '../state/api-client/store'
import * as ApiClientState from '../state/api-client/state'
import { fetchAPIResource } from '../state/api-client/fetch-api-resource'

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

import { type SiteVersion } from './site-version'

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

  async fetchSwatch(swatchId: string): Promise<Swatch | null> {
    const fetch = (id: string, version: SiteVersion | null) => this.fetchSwatchImpl(id, version)

    return await this.store.dispatch(fetchAPIResource(APIResourceType.Swatch, swatchId, fetch))
  }

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

  async fetchFile(fileId: string): Promise<File | null> {
    const fetch = (id: string, version: SiteVersion | null) => this.fetchFileImpl(id, version)

    return await this.store.dispatch(fetchAPIResource(APIResourceType.File, fileId, fetch))
  }

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

  async fetchTypography(typographyId: string): Promise<Typography | null> {
    const fetch = (id: string, version: SiteVersion | null) => this.fetchTypographyImpl(id, version)

    return await this.store.dispatch(
      fetchAPIResource(APIResourceType.Typography, typographyId, fetch),
    )
  }

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

  async fetchGlobalElement(globalElementId: string): Promise<GlobalElement | null> {
    const fetch = (id: string, version: SiteVersion | null) =>
      this.fetchGlobalElementImpl(id, version)

    return await this.store.dispatch(
      fetchAPIResource(APIResourceType.GlobalElement, globalElementId, fetch),
    )
  }

  readGlobalElement(globalElementId: string): GlobalElement | null {
    return ApiClientState.getAPIResource(
      this.store.getState(),
      APIResourceType.GlobalElement,
      globalElementId,
    )
  }

  async fetchLocalizedGlobalElement({
    globalElementId,
    locale,
  }: {
    globalElementId: string
    locale: string
  }): Promise<LocalizedGlobalElement | null> {
    const fetch = (id: string, version: SiteVersion | null, locale: string | null | undefined) => {
      if (locale == null) throw new Error('Locale is required to fetch LocalizedGlobalElement')
      return this.fetchLocalizedGlobalElementImpl(id, version, locale)
    }

    return await this.store.dispatch(
      fetchAPIResource(APIResourceType.LocalizedGlobalElement, globalElementId, fetch, locale),
    )
  }

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

  async fetchPagePathnameSlice({
    pageId,
    locale,
  }: {
    pageId: string
    locale: string | null
  }): Promise<PagePathnameSlice | null> {
    const fetch = (id: string, version: SiteVersion | null, locale: string | null | undefined) =>
      this.fetchPagePathnameSliceImpl(id, version, locale)

    return await this.store.dispatch(
      fetchAPIResource(APIResourceType.PagePathnameSlice, pageId, fetch, locale),
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

  async fetchTable(tableId: string): Promise<Table | null> {
    const fetch = (id: string, version: SiteVersion | null) => this.fetchTableImpl(id, version)

    return await this.store.dispatch(fetchAPIResource(APIResourceType.Table, tableId, fetch))
  }

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

  protected abstract fetchSwatchImpl(
    id: string,
    version: SiteVersion | null,
  ): Promise<Swatch | null>

  protected abstract fetchFileImpl(id: string, version: SiteVersion | null): Promise<File | null>
  protected abstract fetchTypographyImpl(
    id: string,
    version: SiteVersion | null,
  ): Promise<Typography | null>

  protected abstract fetchGlobalElementImpl(
    id: string,
    version: SiteVersion | null,
  ): Promise<GlobalElement | null>

  protected abstract fetchLocalizedGlobalElementImpl(
    id: string,
    version: SiteVersion | null,
    locale: string,
  ): Promise<LocalizedGlobalElement | null>

  protected abstract fetchPagePathnameSliceImpl(
    id: string,
    version: SiteVersion | null,
    locale: string | null | undefined,
  ): Promise<PagePathnameSlice | null>

  protected abstract fetchTableImpl(id: string, version: SiteVersion | null): Promise<Table | null>
}
