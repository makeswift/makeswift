import { type ThunkAction } from '@reduxjs/toolkit'

import { type SiteVersion } from '../../api/site-version'

import * as SiteVersionState from '../modules/site-version'

import { type Action } from '../actions'
import { apiResourceFulfilled } from '../actions/internal/read-only-actions'
import { setLocalizedResourceId } from '../host-api'

import {
  APIResourceType,
  type APIResource,
  type APIResourceByType,
  type APIResourceLocale,
} from '../../api/types'

import { type State, getHasAPIResource, getAPIResource, getLocalizedResourceId } from './state'

type Thunk<ReturnType> = ThunkAction<ReturnType, State, unknown, Action>

export function fetchAPIResource<T extends APIResourceType>(
  resourceType: T,
  resourceId: string,
  fetchResource: (
    resourceId: string,
    version: SiteVersion | null,
    locale?: APIResourceLocale<T>,
  ) => Promise<APIResourceByType<T> | null>,
  locale?: APIResourceLocale<T>,
): Thunk<Promise<APIResourceByType<T> | null>> {
  return async (dispatch, getState) => {
    const state = getState()
    const version = SiteVersionState.getSiteVersion(state.siteVersion)

    if (getHasAPIResource(state, resourceType, resourceId, locale)) {
      return getAPIResource(state, resourceType, resourceId, locale)
    }

    let resource: APIResource | null

    switch (resourceType) {
      case APIResourceType.Swatch:
      case APIResourceType.File:
      case APIResourceType.Typography:
      case APIResourceType.GlobalElement:
      case APIResourceType.PagePathnameSlice:
      case APIResourceType.Table:
        resource = await fetchResource(resourceId, version, locale)
        break

      case APIResourceType.LocalizedGlobalElement: {
        if (locale == null) throw new Error('Locale is required to fetch LocalizedGlobalElement')

        // If `getLocalizedResourceId` returns null, it means we have tried to fetch the resource,
        // but the resource is not available. If we haven't fetched it yet, it'll return undefined.
        if (getLocalizedResourceId(state, locale, resourceId) === null) {
          return null
        }

        resource = await fetchResource(resourceId, version, locale)

        dispatch(
          setLocalizedResourceId({
            locale,
            resourceId,
            localizedResourceId: resource?.id ?? null,
          }),
        )

        break
      }

      default:
        resource = null
    }

    dispatch(apiResourceFulfilled(resourceType, resourceId, resource, locale))

    return resource as APIResourceByType<T> | null
  }
}
