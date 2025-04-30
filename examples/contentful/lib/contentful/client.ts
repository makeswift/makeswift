import { GraphQLClient } from 'graphql-request'

export const client = new GraphQLClient(
  `https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}`,
  {
    errorPolicy: 'all',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CONTENTFUL_API_TOKEN}`,
    },
  }
)
