import {
  ApolloClient,
  DocumentNode,
  NormalizedCacheObject,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  TypedDocumentNode,
  useQuery as useApolloQuery,
} from '@apollo/client'
import { ApolloProviderProps } from '@apollo/client/react/context'
import { createContext, useContext } from 'react'

const Context = createContext<ApolloClient<NormalizedCacheObject> | undefined>(undefined)

export function useQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>,
): QueryResult<TData, TVariables> {
  const client = useContext(Context)

  return useApolloQuery(query, { client, ...options })
}

export function ApolloProvider({ client, children }: ApolloProviderProps<NormalizedCacheObject>) {
  return <Context.Provider value={client}>{children}</Context.Provider>
}
