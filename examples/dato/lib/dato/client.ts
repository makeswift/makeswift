import { GraphQLClient } from 'graphql-request'

export const client = new GraphQLClient('https://graphql.datocms.com/', {
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_DATO_CMS_API_TOKEN}`,
  },
})
