import { GraphQLClient } from './graphql/client'

import {
  CreateTableRecordMutation,
  FileQuery,
  TableQuery,
  UnversionedResourcesQuery,
} from './graphql/documents'

import {
  type CreateTableRecordMutationResult,
  type CreateTableRecordMutationVariables,
  type FileQueryResult,
  type FileQueryVariables,
  type TableQueryResult,
  type TableQueryVariables,
  type UnversionedResourcesQueryResult,
  type UnversionedResourcesQueryVariables,
} from './graphql/generated/types'

import { type File, type Table } from './types'

export class MakeswiftGraphQLApiClient {
  readonly graphqlClient: GraphQLClient

  constructor({ endpoint }: { endpoint: string }) {
    this.graphqlClient = new GraphQLClient(endpoint, {
      'makeswift-runtime-version': PACKAGE_VERSION,
    })
  }

  async createTableRecord(tableId: string, columns: any): Promise<void> {
    await this.graphqlClient.request<
      CreateTableRecordMutationResult,
      CreateTableRecordMutationVariables
    >(CreateTableRecordMutation, { input: { data: { tableId, columns } } })
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

  async getFile(fileId: string): Promise<File | null> {
    const result = await this.graphqlClient.request<FileQueryResult, FileQueryVariables>(
      FileQuery,
      { fileId },
    )

    return result.file
  }

  async getTable(tableId: string): Promise<Table | null> {
    const result = await this.graphqlClient.request<TableQueryResult, TableQueryVariables>(
      TableQuery,
      { tableId },
    )

    return result.table
  }
}
