import { env } from 'env'
import { GraphQLClient } from 'graphql-request'
import { GRAPHQL_ENDPOINT } from 'graphql.config'

export const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
  errorPolicy: 'all',
  headers: {
    Authorization: `Bearer ${env.SANITY_ACCESS_TOKEN}`,
  },
})
