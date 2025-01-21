import { applyMiddleware, createStore, type Store as ReduxStore } from 'redux'
import thunk, { type ThunkAction, type ThunkDispatch } from 'redux-thunk'
import { composeWithDevToolsDevelopmentOnly } from '@redux-devtools/extension'

import { serializeState } from '../utils/serializeState'

import * as APIResources from './modules/api-resources'
import { Action, ActionTypes, apiResourceFulfilled } from './actions'
import {
  APIResource,
  APIResourceType,
  Swatch,
  File,
  Typography,
  GlobalElement,
  PagePathnameSlice,
  Table,
  LocalizedGlobalElement,
} from '../api'

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

type Thunk<ReturnType> = ThunkAction<ReturnType, State, unknown, Action>

async function fetchJson<T>(url: string): Promise<T | null> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  })

  if (response.status === 404) return null

  if (!response.ok) throw new Error(response.statusText)

  if (response.headers.get('content-type')?.includes('application/json') !== true) {
    throw new Error(
      `Expected JSON response from "${url}" but got "${response.headers.get('content-type')}"`,
    )
  }

  return response.json()
}

export function fetchAPIResource<T extends APIResourceType>(
  resourceType: T,
  resourceId: string,
  locale?: Intl.Locale,
): Thunk<Promise<Extract<APIResource, { __typename: T }> | null>> {
  return async (dispatch, getState) => {
    const state = getState()

    if (getHasAPIResource(state, resourceType, resourceId)) {
      return getAPIResource(state, resourceType, resourceId)
    }

    let resource: APIResource | null

    switch (resourceType) {
      case APIResourceType.Swatch:
        resource = await fetchJson<Swatch>(`/api/makeswift/swatches/${resourceId}`)
        break

      case APIResourceType.File:
        resource = await fetchJson<File>(`/api/makeswift/files/${resourceId}`)
        break

      case APIResourceType.Typography:
        resource = await fetchJson<Typography>(`/api/makeswift/typographies/${resourceId}`)
        break

      case APIResourceType.GlobalElement:
        resource = await fetchJson<GlobalElement>(`/api/makeswift/global-elements/${resourceId}`)
        break

      case APIResourceType.LocalizedGlobalElement: {
        if (locale == null) throw new Error('Locale is required to fetch LocalizedGlobalElement')

        resource = await fetchJson<LocalizedGlobalElement>(
          `/api/makeswift/localized-global-elements/${resourceId}/${locale}`,
        )
        break
      }

      case APIResourceType.PagePathnameSlice: {
        const url = new URL(`/api/makeswift/page-pathname-slices/${resourceId}`, 'http://n')

        if (locale != null) url.searchParams.set('locale', locale.toString())

        resource = await fetchJson<PagePathnameSlice>(url.pathname + url.search)
        break
      }

      case APIResourceType.Table:
        resource = await fetchJson<Table>(`/api/makeswift/tables/${resourceId}`)
        break

      default:
        resource = null
    }

    dispatch(apiResourceFulfilled(resourceType, resourceId, resource))

    return resource as Extract<APIResource, { __typename: T }> | null
  }
}

export type Dispatch = ThunkDispatch<State, unknown, Action>

export type Store = ReduxStore<State, Action> & { dispatch: Dispatch }

export function configureStore({ serializedState }: { serializedState?: SerializedState }): Store {
  const composeEnhancers = composeWithDevToolsDevelopmentOnly({
    name: `API client store (${new Date().toISOString()})`,
    serialize: true,
    stateSanitizer: (state: any) => serializeState(state),
    actionsDenylist: [
      ActionTypes.BUILDER_POINTER_MOVE,
      ActionTypes.HANDLE_POINTER_MOVE,
      ActionTypes.ELEMENT_FROM_POINT_CHANGE,
    ],
  })

  return createStore(
    reducer,
    APIResources.getInitialState(serializedState),
    composeEnhancers(applyMiddleware(thunk)),
  )
}
