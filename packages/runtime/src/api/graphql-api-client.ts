import { GraphQLClient } from './graphql/client'
import { CreateTableRecordMutation } from './graphql/documents'
import {
  CreateTableRecordMutationResult,
  CreateTableRecordMutationVariables,
} from './graphql/generated/types'

export class MakeswiftGraphQLApiClient {
  readonly graphqlClient: GraphQLClient

  constructor({ endpoint }: { endpoint: string }) {
    this.graphqlClient = new GraphQLClient(endpoint)
  }

  async createTableRecord(tableId: string, columns: any): Promise<void> {
    await this.graphqlClient.request<
      CreateTableRecordMutationResult,
      CreateTableRecordMutationVariables
    >(CreateTableRecordMutation, { input: { data: { tableId, columns } } })
  }
}
