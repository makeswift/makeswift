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

import { ApiResourcesClient } from './api-resources-client'
import { MakeswiftGraphQLApiClient } from './graphql-api-client'
import { MakeswiftRestAPIClient } from './rest-api-client'
import { type SiteVersion } from './site-version'

/**
 * Server-side implementation that makes direct authenticated requests to the Makeswift API.
 * Requires an API key.
 *
 * For client-side usage, see `HostApiResourcesClient`, which goes through the host via
 * `/api/makeswift/...` endpoints.
 */
export class MakeswiftApiResourcesClient extends ApiResourcesClient {
  private restApiClient: MakeswiftRestAPIClient
  private graphQlClient: MakeswiftGraphQLApiClient

  constructor({
    fetch,
    apiKey,
    apiOrigin,
    graphqlApiEndpoint,
    preloadedState,
  }: {
    fetch: HttpFetch
    apiKey: string
    apiOrigin: string
    graphqlApiEndpoint: string
    preloadedState: Partial<ApiClientState>
  }) {
    super({
      store: configureClientStore({ preloadedState }),
    })

    this.restApiClient = new MakeswiftRestAPIClient({ fetch, apiKey, apiOrigin })
    this.graphQlClient = new MakeswiftGraphQLApiClient({ endpoint: graphqlApiEndpoint })
  }

  protected async fetchSwatchImpl(id: string, version: SiteVersion | null): Promise<Swatch | null> {
    return this.restApiClient.getSwatch(id, version)
  }

  protected async fetchFileImpl(id: string, _version: SiteVersion | null): Promise<File | null> {
    // files are unversioned
    return this.graphQlClient.getFile(id)
  }

  protected async fetchTypographyImpl(
    id: string,
    version: SiteVersion | null,
  ): Promise<Typography | null> {
    return this.restApiClient.getTypography(id, version)
  }

  protected async fetchGlobalElementImpl(
    id: string,
    version: SiteVersion | null,
  ): Promise<GlobalElement | null> {
    return this.restApiClient.getGlobalElement(id, version)
  }

  protected async fetchLocalizedGlobalElementImpl(
    id: string,
    version: SiteVersion | null,
    locale: string,
  ): Promise<LocalizedGlobalElement | null> {
    return this.restApiClient.getLocalizedGlobalElement(id, locale, version)
  }

  protected async fetchPagePathnameSliceImpl(
    id: string,
    version: SiteVersion | null,
    locale: string | null | undefined,
  ): Promise<PagePathnameSlice | null> {
    return this.restApiClient.getPagePathnameSlice(id, version, { locale })
  }

  protected async fetchTableImpl(id: string, _version: SiteVersion | null): Promise<Table | null> {
    // tables are unversioned
    return this.graphQlClient.getTable(id)
  }
}
