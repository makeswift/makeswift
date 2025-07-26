import { env } from 'env'
import { GraphQLClient } from 'graphql-request'

export const client = new GraphQLClient('http://127.0.0.1:1337/graphql', {
  errorPolicy: 'all',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${env.STRAPI_ACCESS_TOKEN}`,
  },
})
