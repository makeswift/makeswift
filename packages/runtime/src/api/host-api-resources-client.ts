import { type State as ApiClientState } from '../state/api-client/state'
import { fetchAPIResource } from '../state/api-client/fetch-api-resource'
import { configureClientStore } from '../state/api-client/client-store'

import {
  type File,
  type GlobalElement,
  type LocalizedGlobalElement,
  type PagePathnameSlice,
  type Swatch,
  type Table,
  type Typography,
  type HttpFetch,
  APIResourceType,
} from './types'

import { ApiResourcesClient } from './api-resources-client'

export { CacheData } from './api-resources-client'

/**
 * NOTE(miguel): This "client" is used to fetch Makeswift API resources needed for the host. For
 * example, swatches, files, typographies, etc. Ideally it's internal to the runtime and is only
 * used by controls to transform API references to API resources.
 *
 * Moreover, its use should be reserved for the builder only, since for live pages all Makeswift
 * API resources should be embedded in the "page snapshot". In the builder, this client serves the
 * purpose of sending requests for API resources and keeping a cache so that changes that happen in
 * the builder, like modifying a swatch, can be sent via `postMessage` to the host and the cache can
 * immediately update the value and re-render.
 *
 * Furthermore, the API resources requested shouldn't be requested directly from the Makeswift API
 * as that would require those resources to not be authenticated since the requests come from the
 * browser when running the host. Instead, the requests should go to the host directly, at the
 * Makeswift API endpoint (i.g., `/api/makeswift/[...makeswift]` dynamic route) where the host's
 * API key can be used, securely, in the server. For this reason, this client should really be a
 * client of the host's API, not Makeswift's, intended to build and continuously maintain a realtime
 * snapshot for use in the builder, not the lives pages.
 */
export class HostApiResourcesClient extends ApiResourcesClient {
  readonly fetch: HttpFetch

  constructor({
    fetch,
    preloadedState,
  }: {
    fetch: HttpFetch
    preloadedState: Partial<ApiClientState>
  }) {
    super({
      store: configureClientStore({ preloadedState }),
    })

    this.fetch = fetch
  }

  async fetchSwatch(swatchId: string): Promise<Swatch | null> {
    return await this.store.dispatch(fetchAPIResource(APIResourceType.Swatch, swatchId, this.fetch))
  }

  async fetchFile(fileId: string): Promise<File | null> {
    return await this.store.dispatch(fetchAPIResource(APIResourceType.File, fileId, this.fetch))
  }

  async fetchTypography(typographyId: string): Promise<Typography | null> {
    return await this.store.dispatch(
      fetchAPIResource(APIResourceType.Typography, typographyId, this.fetch),
    )
  }

  async fetchGlobalElement(globalElementId: string): Promise<GlobalElement | null> {
    return await this.store.dispatch(
      fetchAPIResource(APIResourceType.GlobalElement, globalElementId, this.fetch),
    )
  }

  async fetchLocalizedGlobalElement({
    globalElementId,
    locale,
  }: {
    globalElementId: string
    locale: string
  }): Promise<LocalizedGlobalElement | null> {
    return await this.store.dispatch(
      fetchAPIResource(APIResourceType.LocalizedGlobalElement, globalElementId, this.fetch, locale),
    )
  }

  async fetchPagePathnameSlice({
    pageId,
    locale,
  }: {
    pageId: string
    locale: string | null
  }): Promise<PagePathnameSlice | null> {
    return await this.store.dispatch(
      fetchAPIResource(APIResourceType.PagePathnameSlice, pageId, this.fetch, locale),
    )
  }

  async fetchTable(tableId: string): Promise<Table | null> {
    return await this.store.dispatch(fetchAPIResource(APIResourceType.Table, tableId, this.fetch))
  }
}
