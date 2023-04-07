import { applyMiddleware, createStore, Store as ReduxStore } from 'redux'
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'

import * as APIResources from './modules/api-resources'
import { Action, apiResourceFulfilled } from './actions'
import { APIResource, APIResourceType } from '../api'
import { GraphQLClient } from '../api/graphql/client'
import {
  FileQuery,
  GlobalElementQuery,
  PagePathnamesByIdQuery,
  SwatchQuery,
  TableQuery,
  TypographyQuery,
} from '../api/graphql/documents'
import {
  FileQueryResult,
  FileQueryVariables,
  GlobalElementQueryResult,
  GlobalElementQueryVariables,
  PagePathnamesByIdQueryResult,
  PagePathnamesByIdQueryVariables,
  SwatchQueryResult,
  SwatchQueryVariables,
  TableQueryResult,
  TableQueryVariables,
  TypographyQueryResult,
  TypographyQueryVariables,
} from '../api/graphql/generated/types'

const reducer = APIResources.reducer

export type State = ReturnType<typeof reducer>

export type SerializedState = APIResources.SerializedState

export function getSerializedState(state: State): SerializedState {
  return APIResources.getSerializedState(state)
}

export function getHasAPIResource(
  state: State,
  resourceType: APIResourceType,
  resourceId: string,
): boolean {
  return APIResources.getHasAPIResource(state, resourceType, resourceId)
}

export function getAPIResource<T extends APIResourceType>(
  state: State,
  resourceType: T,
  resourceId: string,
): Extract<APIResource, { __typename: T }> | null {
  return APIResources.getAPIResource(state, resourceType, resourceId)
}

type Thunk<ReturnType> = ThunkAction<ReturnType, State, GraphQLClient, Action>

export function fetchAPIResource<T extends APIResourceType>(
  resourceType: T,
  resourceId: string,
): Thunk<Promise<Extract<APIResource, { __typename: T }> | null>> {
  return async (dispatch, getState, client) => {
    const state = getState()

    if (getHasAPIResource(state, resourceType, resourceId)) {
      return getAPIResource(state, resourceType, resourceId)
    }

    let resource: APIResource | null

    switch (resourceType) {
      case APIResourceType.Swatch:
        resource = (
          await client.request<SwatchQueryResult, SwatchQueryVariables>(SwatchQuery, {
            swatchId: resourceId,
          })
        ).swatch
        break

      case APIResourceType.File:
        resource = (
          await client.request<FileQueryResult, FileQueryVariables>(FileQuery, {
            fileId: resourceId,
          })
        ).file
        break

      case APIResourceType.Typography:
        resource = (
          await client.request<TypographyQueryResult, TypographyQueryVariables>(TypographyQuery, {
            typographyId: resourceId,
          })
        ).typography
        break

      case APIResourceType.GlobalElement:
        resource = (
          await client.request<GlobalElementQueryResult, GlobalElementQueryVariables>(
            GlobalElementQuery,
            { globalElementId: resourceId },
          )
        ).globalElement
        break

      case APIResourceType.PagePathnameSlice:
        resource =
          (
            await client.request<PagePathnamesByIdQueryResult, PagePathnamesByIdQueryVariables>(
              PagePathnamesByIdQuery,
              { pageIds: [resourceId] },
            )
          ).pagePathnamesById[0] ?? null
        break

      case APIResourceType.Table:
        resource = (
          await client.request<TableQueryResult, TableQueryVariables>(TableQuery, {
            tableId: resourceId,
          })
        ).table
        break

      default:
        resource = null
    }

    dispatch(apiResourceFulfilled(resourceType, resourceId, resource))

    return resource as Extract<APIResource, { __typename: T }> | null
  }
}

export type Dispatch = ThunkDispatch<State, GraphQLClient, Action>

export type Store = ReduxStore<State, Action> & { dispatch: Dispatch }

export function configureStore({
  graphqlClient,
  serializedState,
}: {
  graphqlClient: GraphQLClient
  serializedState?: SerializedState
}): Store {
  return createStore(
    reducer,
    APIResources.getInitialState(serializedState),
    applyMiddleware(thunk.withExtraArgument(graphqlClient)),
  )
}
