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
import { BatchHttpLink } from '@apollo/client/link/batch-http'
export { gql } from '@apollo/client'
import { createContext, ReactNode, useContext } from 'react'
import { KeyUtils } from 'slate'
import {
  getElementChildren,
  getElementSwatchIds,
  getFileIds,
  getPageIds,
  getTableIds,
  getTypographyIds,
} from '../prop-controllers/introspection'

import {
  ELEMENT_REFERENCE_GLOBAL_ELEMENT,
  INTROSPECTION_QUERY,
  TYPOGRAPHIES_BY_ID,
} from '../components/utils/queries'

import {
  Element,
  ElementData,
  getPropControllerDescriptors,
  isElementReference,
  Store,
} from '../state/react-page'
import {
  PagePathnameSliceFragment,
  PagePathnameSliceFragmentDoc,
  TypographyFragment,
} from './generated/graphql'
import { PropControllerDescriptor } from '../prop-controllers'
import { ListControlData, ListControlType, ShapeControlData, ShapeControlType } from '../controls'
import { storeContextDefaultValue } from '../runtimes/react'

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
      page(existingData, { args, toReference }) {
        return existingData ?? toReference({ __typename: 'Page', id: args?.id }, true)
      },
      site(existingData, { args, toReference }) {
        return existingData ?? toReference({ __typename: 'Site', id: args?.id }, true)
      },
    },
  },
}

const PrefetchContext = createContext(false)

export function useIsPrefetching(): boolean {
  return useContext(PrefetchContext)
}

type CreateApolloClientParams = {
  uri?: string
  cacheData?: NormalizedCacheObject
}

export function createApolloClient({ uri, cacheData }: CreateApolloClientParams) {
  const cache = new InMemoryCache({ typePolicies })

  if (cacheData) cache.restore(cacheData)

  return new ApolloClient({ link: new BatchHttpLink({ uri, batchMax: 100 }), cache })
}

export type MakeswiftClientOptions = {
  uri?: string
  cacheData?: NormalizedCacheObject
}

async function introspect(
  element: Element,
  client: ApolloClient<NormalizedCacheObject>,
  store: Store,
) {
  const descriptors = getPropControllerDescriptors(store.getState())
  const swatchIds = new Set<string>()
  const fileIds = new Set<string>()
  const typographyIds = new Set<string>()
  const tableIds = new Set<string>()
  const pageIds = new Set<string>()

  const remaining = [element]
  let current: Element | undefined

  while ((current = remaining.pop())) {
    let element: ElementData

    if (isElementReference(current)) {
      const query = await client.query({
        query: ELEMENT_REFERENCE_GLOBAL_ELEMENT,
        variables: { id: current.value },
      })

      const elementData = query.data?.globalElement?.data

      if (elementData == null) continue

      element = elementData
    } else {
      element = current
    }

    const elementDescriptors = descriptors.get(element.type)

    if (elementDescriptors == null) continue

    getResourcesFromElementDescriptors(elementDescriptors, element.props)

    function getResourcesFromElementDescriptors(
      elementDescriptors: Record<string, PropControllerDescriptor>,
      props: ElementData['props'],
    ) {
      Object.entries(elementDescriptors).forEach(([propName, descriptor]) => {
        getElementSwatchIds(descriptor, props[propName]).forEach(swatchId => {
          swatchIds.add(swatchId)
        })

        getFileIds(descriptor, props[propName]).forEach(fileId => fileIds.add(fileId))

        getTypographyIds(descriptor, props[propName]).forEach(typographyId =>
          typographyIds.add(typographyId),
        )

        getTableIds(descriptor, props[propName]).forEach(tableId => tableIds.add(tableId))

        getPageIds(descriptor, props[propName]).forEach(pageId => pageIds.add(pageId))

        getElementChildren(descriptor, props[propName]).forEach(child => remaining.push(child))

        if (descriptor.type === ShapeControlType) {
          const prop = props[propName] as ShapeControlData

          if (prop == null) return

          getResourcesFromElementDescriptors(descriptor.config.type, prop)
        }

        if (descriptor.type === ListControlType) {
          const prop = props[propName] as ListControlData

          if (prop == null) return

          prop.forEach(item => {
            getResourcesFromElementDescriptors(
              { propName: descriptor.config.type },
              { propName: item.value },
            )
          })
        }
      })
    }
  }

  const typographiesResult = await client.query({
    query: TYPOGRAPHIES_BY_ID,
    variables: { ids: [...typographyIds] },
  })

  typographiesResult?.data?.typographies.forEach((typography: TypographyFragment) => {
    typography.style.forEach(style => {
      const swatchId = style.value.color?.swatchId

      if (swatchId != null) swatchIds.add(swatchId)
    })
  })

  return {
    swatchIds: [...swatchIds],
    fileIds: [...fileIds],
    typographyIds: [...typographyIds],
    tableIds: [...tableIds],
    pageIds: [...pageIds],
  }
}

export class MakeswiftClient {
  apolloClient: ApolloClient<NormalizedCacheObject>

  constructor({ uri, cacheData }: MakeswiftClientOptions) {
    this.apolloClient = createApolloClient({ uri, cacheData })
  }

  async prefetch(element: Element): Promise<NormalizedCacheObject> {
    const introspectionData = await introspect(element, this.apolloClient, storeContextDefaultValue)

    const res = await this.apolloClient.query({
      query: INTROSPECTION_QUERY,
      variables: introspectionData,
    })

    // We're doing this because the API return the id without turning it to nodeId:
    // '87237bda-e775-48d8-92cc-399c65577bb7' vs 'UGFnZTo4NzIzN2JkYS1lNzc1LTQ4ZDgtOTJjYy0zOTljNjU1NzdiYjc='
    res.data.pagePathnamesById.forEach((pagePathnameSlice: PagePathnameSliceFragment) => {
      const id = Buffer.from(`Page:${pagePathnameSlice.id}`).toString('base64')

      this.apolloClient.cache.writeFragment({
        fragment: PagePathnameSliceFragmentDoc,
        data: { ...pagePathnameSlice, id },
      })
    })

    KeyUtils.resetGenerator()

    return this.apolloClient.cache.extract()
  }

  updateCacheData(cacheData: NormalizedCacheObject): void {
    this.apolloClient.cache.restore(cacheData)
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
