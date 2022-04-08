import {
  ApolloClient,
  DocumentNode,
  NormalizedCacheObject,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  TypedDocumentNode,
  useQuery as useApolloQuery,
  useMutation as useApolloMutation,
  DefaultContext,
  ApolloCache,
  MutationHookOptions,
  MutationTuple,
  InMemoryCache,
  TypePolicies,
} from '@apollo/client'
import { getDataFromTree } from '@apollo/client/react/ssr'
export { gql } from '@apollo/client'
import { createContext, ReactNode, useContext } from 'react'
import uuid from 'uuid/v4'

import { DocumentReference, RuntimeProvider } from '../react'
import { createDocumentReference, Element } from '../state/react-page'

const typePolicies: TypePolicies = {
  Query: {
    fields: {
      swatches(existingData, { args, toReference }) {
        return (
          existingData ??
          args?.ids.map((id: string) => toReference({ __typename: 'Swatch', id }, true))
        )
      },
      file(existingData, { args, toReference }) {
        return existingData ?? toReference({ __typename: 'File', id: args?.id }, true)
      },
      files(existingData, { args, toReference }) {
        return (
          existingData ??
          args?.ids.map((id: string) => toReference({ __typename: 'File', id }, true))
        )
      },
      typographies(existingData, { args, toReference }) {
        return (
          existingData ??
          args?.ids.map((id: string) => toReference({ __typename: 'Typography', id }, true))
        )
      },
      pagePathnamesById(existingData, { args, toReference }) {
        return (
          existingData ??
          args?.ids.map((id: string) => toReference({ __typename: 'PagePathnameSlice', id }, true))
        )
      },
      globalElement(existingData, { args, toReference }) {
        return existingData ?? toReference({ __typename: 'GlobalElement', id: args?.id }, true)
      },
      table(existingData, { args, toReference }) {
        return existingData ?? toReference({ __typename: 'Table', id: args?.id }, true)
      },
    },
  },
}

type CreateApolloClientParams = {
  uri?: string
  cacheData?: NormalizedCacheObject
}

export function createApolloClient({ uri, cacheData }: CreateApolloClientParams) {
  const cache = new InMemoryCache({ typePolicies })

  if (cacheData) cache.restore(cacheData)

  return new ApolloClient({ uri, cache })
}

export type MakeswiftClientOptions = {
  uri?: string
  cacheData?: NormalizedCacheObject
}

export class MakeswiftClient {
  apolloClient: ApolloClient<NormalizedCacheObject>

  constructor({ uri, cacheData }: MakeswiftClientOptions) {
    this.apolloClient = createApolloClient({ uri, cacheData })
  }

  async prefetch(element: Element): Promise<NormalizedCacheObject> {
    const id = uuid()

    await getDataFromTree(
      <RuntimeProvider client={this} defaultRootElements={new Map([[id, element]])}>
        <DocumentReference documentReference={createDocumentReference(id)} />
      </RuntimeProvider>,
    )

    return this.apolloClient.cache.extract()
  }
}

const Context = createContext<MakeswiftClient | undefined>(undefined)

export function useQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>,
): QueryResult<TData, TVariables> {
  const client = useContext(Context)

  return useApolloQuery(query, { client: client?.apolloClient, ...options })
}

export function useMutation<
  TData = any,
  TVariables = OperationVariables,
  TContext = DefaultContext,
  TCache extends ApolloCache<any> = ApolloCache<any>,
>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: MutationHookOptions<TData, TVariables, TContext>,
): MutationTuple<TData, TVariables, TContext, TCache> {
  const client = useContext(Context)

  return useApolloMutation(mutation, { client: client?.apolloClient, ...options })
}

type MakeswiftProviderProps = {
  client: MakeswiftClient
  children: ReactNode
}

export function MakeswiftProvider({ client, children }: MakeswiftProviderProps) {
  return <Context.Provider value={client}>{children}</Context.Provider>
}
