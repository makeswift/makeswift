import { type ThunkAction } from '@reduxjs/toolkit'

import { type SiteVersion, ApiHandlerHeaders, serializeSiteVersion } from '../../api/site-version'

import * as SiteVersionState from '../modules/site-version'

import { type Action } from '../actions'
import { apiResourceFulfilled } from '../actions/internal/read-only-actions'
import { setLocalizedResourceId } from '../host-api'

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
  type HttpFetch,
} from '../../api/types'

import { type State, getHasAPIResource, getAPIResource, getLocalizedResourceId } from './state'

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
