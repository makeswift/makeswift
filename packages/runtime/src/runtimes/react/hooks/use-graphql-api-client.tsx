'use client'

import { MakeswiftGraphQLApiClient } from '../../../api/graphql-api-client'

import { useReactRuntime } from './use-react-runtime'

export function useMakeswiftGraphQLApiClient(): MakeswiftGraphQLApiClient {
  const runtime = useReactRuntime()
  return new MakeswiftGraphQLApiClient({ endpoint: runtime.graphqlApiEndpoint })
}
