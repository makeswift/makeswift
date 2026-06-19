import { type State as ApiClientState } from '../state/api-client/state'

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
} from './types'

import { type SiteVersion, ApiHandlerHeaders, serializeSiteVersion } from './site-version'
import { ApiResourcesClient } from './api-resources-client'

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

  protected async fetchSwatchImpl(id: string, version: SiteVersion | null): Promise<Swatch | null> {
    return await this.fetchVersioned<Swatch>(`/api/makeswift/swatches/${id}`, version)
  }

  protected async fetchFileImpl(id: string, version: SiteVersion | null): Promise<File | null> {
    return await this.fetchVersioned<File>(`/api/makeswift/files/${id}`, version)
  }

  protected async fetchTypographyImpl(
    id: string,
    version: SiteVersion | null,
  ): Promise<Typography | null> {
    return await this.fetchVersioned<Typography>(`/api/makeswift/typographies/${id}`, version)
  }

  protected async fetchGlobalElementImpl(
    id: string,
    version: SiteVersion | null,
  ): Promise<GlobalElement | null> {
    return await this.fetchVersioned<GlobalElement>(`/api/makeswift/global-elements/${id}`, version)
  }

  protected async fetchLocalizedGlobalElementImpl(
    id: string,
    version: SiteVersion | null,
    locale: string,
  ): Promise<LocalizedGlobalElement | null> {
    return await this.fetchVersioned<LocalizedGlobalElement>(
      `/api/makeswift/localized-global-elements/${id}/${locale}`,
      version,
    )
  }

  protected async fetchPagePathnameSliceImpl(
    id: string,
    version: SiteVersion | null,
    locale: string | null | undefined,
  ): Promise<PagePathnameSlice | null> {
    const url = new URL(`/api/makeswift/page-pathname-slices/${id}`, 'http://n')

    if (locale != null) url.searchParams.set('locale', locale)

    return await this.fetchVersioned<PagePathnameSlice>(url.pathname + url.search, version)
  }

  protected async fetchTableImpl(id: string, version: SiteVersion | null): Promise<Table | null> {
    return await this.fetchVersioned<Table>(`/api/makeswift/tables/${id}`, version)
  }

  private async fetchVersioned<T>(url: string, version: SiteVersion | null): Promise<T | null> {
    const response = await this.fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(version != null
          ? { [ApiHandlerHeaders.SiteVersion]: serializeSiteVersion(version) }
          : {}),
      },
    })

    if (response.status === 404) return null
    if (!response.ok) throw new Error(response.statusText)

    if (response.headers.get('content-type')?.includes('application/json') !== true) {
      throw new Error(
        `Expected JSON response from "${url}" but got "${response.headers.get('content-type')}"`,
      )
    }

    return response.json()
  }
}
