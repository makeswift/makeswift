import * as prismic from '@prismicio/client'
import { GraphQLClient } from 'graphql-request'

import { env } from '@/env'

const prismicClient = prismic.createClient(env.PRISMIC_REPOSITORY_NAME, {
  accessToken: env.PRISMIC_ACCESS_TOKEN,
})

export const client = new GraphQLClient(prismic.getGraphQLEndpoint(env.PRISMIC_REPOSITORY_NAME), {
  fetch: prismicClient.graphQLFetch as typeof fetch,
  method: 'GET',
})
