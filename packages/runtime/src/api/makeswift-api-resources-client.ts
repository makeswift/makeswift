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
import { type SiteVersion } from './site-version'

// see the comment in `MakeswiftApiResourcesClient` constructor below
import { type MakeswiftGraphQLApiClient } from './graphql-api-client'
import { type MakeswiftRestAPIClient } from './rest-api-client'

/**
 * Server-side implementation that makes direct authenticated requests to the Makeswift API.
 * Requires an API key.
 *
 * For client-side usage, see `HostApiResourcesClient`, which goes through the host via
 * `/api/makeswift/...` endpoints.
 */
export class MakeswiftApiResourcesClient extends ApiResourcesClient {
  private restApiClient: Promise<MakeswiftRestAPIClient>
  private graphQlClient: Promise<MakeswiftGraphQLApiClient>

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

    // `MakeswiftApiResourcesClient` is used by the runtime and therefore will be imported
    // on the client; lazy import server-side REST/GraphQL clients to avoid unnecessarily
    // pulling their code into a client bundle.
    //
    // (we can't easily lazy-load `MakeswiftApiResourcesClient` itself, at it will make its
    // construction async, but because it shares most of its implementation with
    // `HostApiResourcesClient`, the overhead of this module on its own is negligible)
    this.restApiClient = (async () => {
      const { MakeswiftRestAPIClient } = await import('./rest-api-client')
      return new MakeswiftRestAPIClient({ fetch, apiKey, apiOrigin })
    })()

    this.graphQlClient = (async () => {
      const { MakeswiftGraphQLApiClient } = await import('./graphql-api-client')
      return new MakeswiftGraphQLApiClient({ endpoint: graphqlApiEndpoint })
    })()
  }

  protected async fetchSwatchImpl(id: string, version: SiteVersion | null): Promise<Swatch | null> {
    return (await this.restApiClient).getSwatch(id, version)
  }

  protected async fetchFileImpl(id: string, _version: SiteVersion | null): Promise<File | null> {
    // files are unversioned
    return (await this.graphQlClient).getFile(id)
  }

  protected async fetchTypographyImpl(
    id: string,
    version: SiteVersion | null,
  ): Promise<Typography | null> {
    return (await this.restApiClient).getTypography(id, version)
  }

  protected async fetchGlobalElementImpl(
    id: string,
    version: SiteVersion | null,
  ): Promise<GlobalElement | null> {
    return (await this.restApiClient).getGlobalElement(id, version)
  }

  protected async fetchLocalizedGlobalElementImpl(
    id: string,
    version: SiteVersion | null,
    locale: string,
  ): Promise<LocalizedGlobalElement | null> {
    return (await this.restApiClient).getLocalizedGlobalElement(id, locale, version)
  }

  protected async fetchPagePathnameSliceImpl(
    id: string,
    version: SiteVersion | null,
    locale: string | null | undefined,
  ): Promise<PagePathnameSlice | null> {
    return (await this.restApiClient).getPagePathnameSlice(id, version, { locale })
  }

  protected async fetchTableImpl(id: string, _version: SiteVersion | null): Promise<Table | null> {
    // tables are unversioned
    return (await this.graphQlClient).getTable(id)
  }
}
