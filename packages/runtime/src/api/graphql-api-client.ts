import { GraphQLClient } from './graphql/client'

import { TableQuery, UnversionedResourcesQuery } from './graphql/documents'

import {
  type TableQueryResult,
  type TableQueryVariables,
  type UnversionedResourcesQueryResult,
  type UnversionedResourcesQueryVariables,
} from './graphql/generated/types'

import { type Table } from './types'

export class MakeswiftGraphQLApiClient {
  readonly graphqlClient: GraphQLClient

  constructor({ endpoint }: { endpoint: string }) {
    this.graphqlClient = new GraphQLClient(endpoint, {
      'makeswift-runtime-version': PACKAGE_VERSION,
    })
  }

  async getUnversionedResources({
    fileIds,
    tableIds,
  }: UnversionedResourcesQueryVariables): Promise<UnversionedResourcesQueryResult> {
    return await this.graphqlClient.request<
      UnversionedResourcesQueryResult,
      UnversionedResourcesQueryVariables
    >(UnversionedResourcesQuery, { fileIds, tableIds })
  }

  async getTable(tableId: string): Promise<Table | null> {
    const result = await this.graphqlClient.request<TableQueryResult, TableQueryVariables>(
      TableQuery,
      { tableId },
    )

    return result.table
  }
}
