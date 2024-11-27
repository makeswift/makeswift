import * as prismic from '@prismicio/client'
import { GraphQLClient } from 'graphql-request'

const CLIENT_NAME = 'makeswift-prismic-example'

const prismicClient = prismic.createClient(CLIENT_NAME, {
  accessToken: process.env.NEXT_PUBLIC_PRISMIC_API_TOKEN,
})

export const client = new GraphQLClient(prismic.getGraphQLEndpoint(CLIENT_NAME), {
  // @ts-expect-error seems like a bug in the types
  fetch: prismicClient.graphQLFetch,
  method: 'GET',
})
