import { env } from 'env'
import { GraphQLClient } from 'graphql-request'

export const client = new GraphQLClient(
  `https://graphql.contentful.com/content/v1/spaces/${env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}`,
  {
    errorPolicy: 'all',
    headers: {
      Authorization: `Bearer ${env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN}`,
    },
  }
)
