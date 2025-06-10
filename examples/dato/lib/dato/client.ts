import { env } from 'env'
import { GraphQLClient } from 'graphql-request'

export const client = new GraphQLClient('https://graphql.datocms.com/', {
  headers: {
    Authorization: `Bearer ${env.DATO_CMS_API_TOKEN}`,
  },
})
