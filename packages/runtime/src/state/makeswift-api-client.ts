import {
  configureStore as configureReduxStore,
  combineReducers,
  type ThunkAction,
  type ThunkMiddleware,
  type ThunkDispatch,
  UnknownAction,
} from '@reduxjs/toolkit'

import { type SiteVersion, ApiHandlerHeaders, serializeSiteVersion } from '../api/site-version'

import * as SiteVersionState from './modules/site-version'
import * as LocaleState from './modules/locale'
import * as APIResources from './modules/api-resources'
import * as LocalizedResourcesMap from './modules/localized-resources-map'

import { type Action, ActionTypes } from './actions'
import { apiResourceFulfilled, ReadOnlyActionTypes } from './actions/internal/read-only-actions'
import { clearAPIClientCache } from './actions/internal/read-write-actions'
import { setLocalizedResourceId } from './host-api'
import { actionMiddleware, middlewareOptions, devToolsConfig } from './toolkit'

import {
  APIResourceType,
  type APIResource,
  type Swatch,
  type File,
  type Typography,
  type GlobalElement,
  type PagePathnameSlice,
  type Table,
  type LocalizedGlobalElement,
  type APIResourceLocale,
} from '../api'

const reducer = combineReducers({
  siteVersion: SiteVersionState.reducer,
  locale: LocaleState.reducer,
  apiResources: APIResources.reducer,
  localizedResourcesMap: LocalizedResourcesMap.reducer,
})

export type State = ReturnType<typeof reducer>
export type Dispatch = ThunkDispatch<State, unknown, Action>
export type HttpFetch = (url: string | URL, init?: RequestInit) => Promise<Response>

export type SerializedState = {
  apiResources: APIResources.SerializedState
  localizedResourcesMap: LocalizedResourcesMap.SerializedState
}

function getLocalizedResourceId(
  state: State,
  locale: string,
  resourceId: string,
): string | undefined | null {
  return LocalizedResourcesMap.getLocalizedResourceId(
    state.localizedResourcesMap,
    locale,
    resourceId,
  )
}

export function getHasAPIResource<T extends APIResourceType>(
  state: State,
  resourceType: APIResourceType,
  resourceId: string,
  locale?: APIResourceLocale<T>,
): boolean {
  switch (resourceType) {
    case APIResourceType.LocalizedGlobalElement:
      if (locale == null) {
        console.error(`Attempt to access ${resourceType} ${resourceId} without a locale`)
        return false
      }

      const localizedId = getLocalizedResourceId(state, locale, resourceId)
      return (
        localizedId != null &&
        APIResources.getHasAPIResource(state.apiResources, resourceType, localizedId, locale)
      )

    default:
      return APIResources.getHasAPIResource(state.apiResources, resourceType, resourceId, locale)
  }
}

export function getAPIResource<T extends APIResourceType>(
  state: State,
  resourceType: T,
  resourceId: string,
  locale?: APIResourceLocale<T>,
): Extract<APIResource, { __typename: T }> | null {
  switch (resourceType) {
    case APIResourceType.LocalizedGlobalElement:
      if (locale == null) {
        console.error(`Attempt to access ${resourceType} ${resourceId} without a locale`)
        return null
      }

      const localizedId = getLocalizedResourceId(state, locale, resourceId)
      return localizedId != null
        ? APIResources.getAPIResource(state.apiResources, resourceType, localizedId, locale)
        : null

    default:
      return APIResources.getAPIResource(state.apiResources, resourceType, resourceId, locale)
  }
}

type Thunk<ReturnType> = ThunkAction<ReturnType, State, unknown, Action>

export function fetchAPIResource<T extends APIResourceType>(
  resourceType: T,
  resourceId: string,
  fetch: HttpFetch,
  locale?: APIResourceLocale<T>,
): Thunk<Promise<Extract<APIResource, { __typename: T }> | null>> {
  const fetchVersioned = async <T>(url: string, version: SiteVersion | null): Promise<T | null> => {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(version != null
          ? { [ApiHandlerHeaders.SiteVersion]: serializeSiteVersion(version) }
          : {}),
      },
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

  return async (dispatch, getState) => {
    const state = getState()
    const version = SiteVersionState.getSiteVersion(state.siteVersion)

    if (getHasAPIResource(state, resourceType, resourceId, locale)) {
      return getAPIResource(state, resourceType, resourceId, locale)
    }

    let resource: APIResource | null

    switch (resourceType) {
      case APIResourceType.Swatch:
        resource = await fetchVersioned<Swatch>(`/api/makeswift/swatches/${resourceId}`, version)
        break

      case APIResourceType.File:
        resource = await fetchVersioned<File>(`/api/makeswift/files/${resourceId}`, version)
        break

      case APIResourceType.Typography:
        resource = await fetchVersioned<Typography>(
          `/api/makeswift/typographies/${resourceId}`,
          version,
        )
        break

      case APIResourceType.GlobalElement:
        resource = await fetchVersioned<GlobalElement>(
          `/api/makeswift/global-elements/${resourceId}`,
          version,
        )
        break

      case APIResourceType.LocalizedGlobalElement: {
        if (locale == null) throw new Error('Locale is required to fetch LocalizedGlobalElement')

        // If `getLocalizedResourceId` returns null, it means we have tried to fetch the resource,
        // but the resource is not available. If we haven't fetched it yet, it'll return undefined.
        if (getLocalizedResourceId(state, locale, resourceId) === null) {
          return null
        }

        resource = await fetchVersioned<LocalizedGlobalElement>(
          `/api/makeswift/localized-global-elements/${resourceId}/${locale}`,
          version,
        )

        dispatch(
          setLocalizedResourceId({
            locale,
            resourceId,
            localizedResourceId: resource?.id ?? null,
          }),
        )

        break
      }

      case APIResourceType.PagePathnameSlice: {
        const url = new URL(`/api/makeswift/page-pathname-slices/${resourceId}`, 'http://n')

        if (locale != null) url.searchParams.set('locale', locale)

        resource = await fetchVersioned<PagePathnameSlice>(url.pathname + url.search, version)
        break
      }

      case APIResourceType.Table:
        resource = await fetchVersioned<Table>(`/api/makeswift/tables/${resourceId}`, version)
        break

      default:
        resource = null
    }

    dispatch(apiResourceFulfilled(resourceType, resourceId, resource, locale))

    return resource as Extract<APIResource, { __typename: T }> | null
  }
}

// FIXME: this middleware can be removed once we've upgraded the builder
// to always provide the locale when dispatching resource actions
function defaultLocaleMiddleware(): ThunkMiddleware<State, UnknownAction> {
  return actionMiddleware(({ getState }) => next => {
    return (action: Action) => {
      switch (action.type) {
        case ActionTypes.CHANGE_API_RESOURCE:
        case ActionTypes.EVICT_API_RESOURCE:
        case ActionTypes.SET_LOCALIZED_RESOURCE_ID: {
          const { locale } = action.payload
          return next({
            ...action,
            payload: {
              ...action.payload,
              locale: locale ?? LocaleState.getLocale(getState().locale),
            },
          } as Action)
        }
      }

      return next(action)
    }
  })
}

function cacheVersioningMiddleware(): ThunkMiddleware<State, UnknownAction> {
  return actionMiddleware(({ getState, dispatch }) => next => {
    return (action: Action) => {
      switch (action.type) {
        case ReadOnlyActionTypes.SET_SITE_VERSION: {
          const cacheVersion = SiteVersionState.getSiteVersion(getState().siteVersion)
          if (cacheVersion?.version !== action.payload?.version) {
            dispatch(clearAPIClientCache())
          }
        }
      }

      return next(action)
    }
  })
}

export function configureStore({ serializedState }: { serializedState?: SerializedState }) {
  return configureReduxStore({
    reducer,
    preloadedState: {
      apiResources: APIResources.getInitialState(serializedState?.apiResources),
      localizedResourcesMap: LocalizedResourcesMap.getInitialState(
        serializedState?.localizedResourcesMap,
      ),
    },

    middleware: getDefaultMiddleware =>
      getDefaultMiddleware(middlewareOptions).concat(
        defaultLocaleMiddleware(),
        cacheVersioningMiddleware(),
      ),

    devTools: devToolsConfig({
      name: `API client store (${new Date().toISOString()})`,
      actionsDenylist: [
        ActionTypes.BUILDER_POINTER_MOVE,
        ActionTypes.HANDLE_POINTER_MOVE,
        ActionTypes.ELEMENT_FROM_POINT_CHANGE,
      ],
    }),
  })
}

export type Store = ReturnType<typeof configureStore>
