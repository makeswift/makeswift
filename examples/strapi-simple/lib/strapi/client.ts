import { env } from 'env'
import { GraphQLClient } from 'graphql-request'

export const client = new GraphQLClient(`${env.NEXT_PUBLIC_STRAPI_SERVER_URL}/graphql`, {
  errorPolicy: 'all',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${env.STRAPI_ACCESS_TOKEN}`,
  },
})
