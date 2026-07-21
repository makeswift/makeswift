import { combineReducers, type ThunkDispatch } from '@reduxjs/toolkit'

import * as SiteVersionState from '../modules/site-version'
import * as LocaleState from '../modules/locale'
import * as APIResources from '../modules/api-resources'
import * as LocalizedResourcesMap from '../modules/localized-resources-map'

import { type Action } from '../actions'

import { APIResourceType, type APIResource, type APIResourceLocale } from '../../api'

export const reducer = combineReducers({
  siteVersion: SiteVersionState.reducer,
  locale: LocaleState.reducer,
  apiResources: APIResources.reducer,
  localizedResourcesMap: LocalizedResourcesMap.reducer,
})

export type State = ReturnType<typeof reducer>
export type Dispatch = ThunkDispatch<State, unknown, Action>

export type SerializedState = {
  apiResources: APIResources.SerializedState
  localizedResourcesMap: LocalizedResourcesMap.SerializedState
}

export function getSerializedState(state: State): SerializedState {
  return {
    apiResources: APIResources.getSerializedState(state.apiResources),
    localizedResourcesMap: LocalizedResourcesMap.getSerializedState(state.localizedResourcesMap),
  }
}

export function getLocalizedResourceId(
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
