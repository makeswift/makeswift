import { env } from 'env'
import { GraphQLClient } from 'graphql-request'

export const client = new GraphQLClient(`${env.STRAPI_SERVER_DOMAIN}/graphql`, {
  errorPolicy: 'all',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${env.STRAPI_ACCESS_TOKEN}`,
  },
})
