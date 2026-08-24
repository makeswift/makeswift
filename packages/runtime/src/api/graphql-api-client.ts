import { GraphQLClient } from './graphql/client'

import { UnversionedResourcesQuery } from './graphql/documents'

import {
  type UnversionedResourcesQueryResult,
  type UnversionedResourcesQueryVariables,
} from './graphql/generated/types'

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
}
