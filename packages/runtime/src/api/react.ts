import * as MakeswiftApiClient from '../state/makeswift-api-client'
import {
  APIResourceType,
  File,
  GlobalElement,
  LocalizedGlobalElement,
  Page,
  PagePathnameSlice,
  Site,
  Snippet,
  Swatch,
  Table,
  Typography,
} from './types'
import { GraphQLClient } from './graphql/client'
import { CreateTableRecordMutation } from './graphql/documents'
import {
  CreateTableRecordMutationResult,
  CreateTableRecordMutationVariables,
} from './graphql/generated/types'

export type CacheData = MakeswiftApiClient.SerializedState

export const CacheData = {
  empty(): CacheData {
    return {
      apiResources: {},
      localizedResourcesMap: {},
    }
  },
}

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
export class MakeswiftHostApiClient {
  graphqlClient: GraphQLClient
  makeswiftApiClient: MakeswiftApiClient.Store
  subscribe: MakeswiftApiClient.Store['subscribe']

  constructor({ uri, cacheData, locale }: { uri: string; cacheData?: CacheData; locale?: string }) {
    this.graphqlClient = new GraphQLClient(uri)
    this.makeswiftApiClient = MakeswiftApiClient.configureStore({
      serializedState: cacheData,
      defaultLocale: locale,
    })

    this.subscribe = this.makeswiftApiClient.subscribe
  }

  readSwatch(swatchId: string): Swatch | null {
    return MakeswiftApiClient.getAPIResource(
      this.makeswiftApiClient.getState(),
      APIResourceType.Swatch,
      swatchId,
    )
  }

  async fetchSwatch(swatchId: string): Promise<Swatch | null> {
    return await this.makeswiftApiClient.dispatch(
      MakeswiftApiClient.fetchAPIResource(APIResourceType.Swatch, swatchId),
    )
  }

  readFile(fileId: string): File | null {
    return MakeswiftApiClient.getAPIResource(
      this.makeswiftApiClient.getState(),
      APIResourceType.File,
      fileId,
    )
  }

  async fetchFile(fileId: string): Promise<File | null> {
    return await this.makeswiftApiClient.dispatch(
      MakeswiftApiClient.fetchAPIResource(APIResourceType.File, fileId),
    )
  }

  readTypography(typographyId: string): Typography | null {
    return MakeswiftApiClient.getAPIResource(
      this.makeswiftApiClient.getState(),
      APIResourceType.Typography,
      typographyId,
    )
  }

  async fetchTypography(typographyId: string): Promise<Typography | null> {
    return await this.makeswiftApiClient.dispatch(
      MakeswiftApiClient.fetchAPIResource(APIResourceType.Typography, typographyId),
    )
  }

  readGlobalElement(globalElementId: string): GlobalElement | null {
    return MakeswiftApiClient.getAPIResource(
      this.makeswiftApiClient.getState(),
      APIResourceType.GlobalElement,
      globalElementId,
    )
  }

  async fetchGlobalElement(globalElementId: string): Promise<GlobalElement | null> {
    return await this.makeswiftApiClient.dispatch(
      MakeswiftApiClient.fetchAPIResource(APIResourceType.GlobalElement, globalElementId),
    )
  }

  readLocalizedGlobalElement({
    globalElementId,
    locale,
  }: {
    globalElementId: string
    locale: string
  }): LocalizedGlobalElement | null {
    return MakeswiftApiClient.getAPIResource(
      this.makeswiftApiClient.getState(),
      APIResourceType.LocalizedGlobalElement,
      globalElementId,
      locale,
    )
  }

  async fetchLocalizedGlobalElement({
    globalElementId,
    locale,
  }: {
    globalElementId: string
    locale: string
  }): Promise<LocalizedGlobalElement | null> {
    return await this.makeswiftApiClient.dispatch(
      MakeswiftApiClient.fetchAPIResource(
        APIResourceType.LocalizedGlobalElement,
        globalElementId,
        locale,
      ),
    )
  }

  readPagePathnameSlice({
    pageId,
    locale,
  }: {
    pageId: string
    locale: string | null
  }): PagePathnameSlice | null {
    return MakeswiftApiClient.getAPIResource(
      this.makeswiftApiClient.getState(),
      APIResourceType.PagePathnameSlice,
      pageId,
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
    return await this.makeswiftApiClient.dispatch(
      MakeswiftApiClient.fetchAPIResource(APIResourceType.PagePathnameSlice, pageId, locale),
    )
  }

  readTable(tableId: string): Table | null {
    return MakeswiftApiClient.getAPIResource(
      this.makeswiftApiClient.getState(),
      APIResourceType.Table,
      tableId,
    )
  }

  async fetchTable(tableId: string): Promise<Table | null> {
    return await this.makeswiftApiClient.dispatch(
      MakeswiftApiClient.fetchAPIResource(APIResourceType.Table, tableId),
    )
  }

  async createTableRecord(tableId: string, columns: any): Promise<void> {
    await this.graphqlClient.request<
      CreateTableRecordMutationResult,
      CreateTableRecordMutationVariables
    >(CreateTableRecordMutation, { input: { data: { tableId, columns } } })
  }

  readSite(siteId: string): Site | null {
    return MakeswiftApiClient.getAPIResource(
      this.makeswiftApiClient.getState(),
      APIResourceType.Site,
      siteId,
    )
  }

  readPage(pageId: string): Page | null {
    return MakeswiftApiClient.getAPIResource(
      this.makeswiftApiClient.getState(),
      APIResourceType.Page,
      pageId,
    )
  }

  readSnippet(snippetId: string): Snippet | null {
    return MakeswiftApiClient.getAPIResource(
      this.makeswiftApiClient.getState(),
      APIResourceType.Snippet,
      snippetId,
    )
  }
}
