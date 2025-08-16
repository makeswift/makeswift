import {
  APIResourceType,
  APIResourceLocale,
  LocalizableAPIResourceType,
  type APIResource,
} from '../../api'

import deepEqual from '../../utils/deepEqual'
import { Branded } from '../../utils/branded'

import { type Action, type UnknownAction, ActionTypes, isKnownAction } from '../actions'

type CompositeResourceId = Branded<string, 'CompositeResourceId'>

function isValidAPIResourceType(resourceType: string): resourceType is APIResourceType {
  return resourceType in APIResourceType
}

function isLocalizableAPIResourceType(
  resourceType: APIResourceType,
): resourceType is LocalizableAPIResourceType {
  return resourceType in LocalizableAPIResourceType
}

function compositeId(
  resourceId: string,
  resourceType: APIResourceType,
  locale?: string | null,
): CompositeResourceId {
  return (
    locale != null && isLocalizableAPIResourceType(resourceType)
      ? `${resourceId}@${locale}`
      : resourceId
  ) as CompositeResourceId
}

function parseCompositeId(compositeId: CompositeResourceId): [string, string | null] {
  const [resourceId, locale] = compositeId.split('@')
  return [resourceId, locale ?? null]
}

export type State = Map<APIResourceType, Map<CompositeResourceId, APIResource | null>>

export type SerializedState = {
  [key in APIResourceType]?: {
    id: string
    value: Extract<APIResource, { __typename: key }> | null
    locale?: APIResourceLocale<key>
  }[]
}

export function getInitialState(
  serializedState: SerializedState = {
    Swatch: [],
    File: [],
    Typography: [],
    PagePathnameSlice: [],
    GlobalElement: [],
    Table: [],
    Snippet: [],
    Page: [],
    Site: [],
    LocalizedGlobalElement: [],
  },
): State {
  return new Map(
    Object.entries(serializedState).map(([resourceType, resources]) => [
      resourceType,
      new Map(
        resources.map(({ id, value, locale }) => [
          compositeId(id, resourceType as APIResourceType, locale),
          value,
        ]),
      ),
    ]),
  ) as State
}

export function getSerializedState(state: State): SerializedState {
  const resourceMap: SerializedState = {
    Swatch: [],
    File: [],
    Typography: [],
    PagePathnameSlice: [],
    GlobalElement: [],
    Table: [],
    Snippet: [],
    Page: [],
    Site: [],
    LocalizedGlobalElement: [],
  }

  Array.from(state.entries()).forEach(([resourceType, resources]) => {
    const particularResourceMap: { id: string; value: any; locale?: any }[] = []

    Array.from(resources.entries()).forEach(([compositeId, value]) => {
      if (value != null) {
        const [id, locale] = parseCompositeId(compositeId)
        console.assert(
          locale == null || isLocalizableAPIResourceType(resourceType),
          `Unexpected locale for non-localizable resource type ${resourceType}`,
          { id, locale },
        )

        particularResourceMap.push(locale != null ? { id, value, locale } : { id, value })
      }
    })

    resourceMap[resourceType] = particularResourceMap
  })

  return resourceMap
}

export function getHasAPIResource<T extends APIResourceType>(
  state: State,
  resourceType: T,
  resourceId: string,
  locale?: APIResourceLocale<T>,
): boolean {
  return state.get(resourceType)?.has(compositeId(resourceId, resourceType, locale)) ?? false
}

export function getAPIResource<T extends APIResourceType>(
  state: State,
  resourceType: T,
  resourceId: string,
  locale?: APIResourceLocale<T>,
): Extract<APIResource, { __typename: T }> | null {
  const resource = state.get(resourceType)?.get(compositeId(resourceId, resourceType, locale))

  return resource?.__typename === resourceType
    ? (resource as Extract<typeof resource, { __typename: T }>)
    : null
}

export function reducer(state: State = getInitialState(), action: Action | UnknownAction): State {
  if (!isKnownAction(action)) return state

  switch (action.type) {
    case ActionTypes.UPDATE_API_CLIENT_CACHE: {
      const { apiResources } = action.payload

      return Object.entries(apiResources).reduce((state, [resourceType, cachedResources]) => {
        const resType = resourceType as APIResourceType
        const cached:
          | { id: string; value: APIResource | null; locale?: string | null }[]
          | undefined = cachedResources

        const existing = state.get(resType) ?? new Map<CompositeResourceId, APIResource | null>()
        const updated = cached?.reduce((r, { id, value, locale }) => {
          const cid = compositeId(id, resType, locale)
          return r.get(cid) != null ? r : new Map(r).set(cid, value)
        }, existing)

        return updated == null || updated === existing
          ? state
          : new Map(state).set(resType, updated)
      }, state)
    }

    case ActionTypes.API_RESOURCE_FULFILLED: {
      const { resourceType, resourceId, resource, locale } = action.payload
      return new Map(state).set(
        resourceType,
        new Map(state.get(resourceType)!).set(
          compositeId(resourceId, resourceType, locale),
          resource,
        ),
      )
    }

    case ActionTypes.CHANGE_API_RESOURCE: {
      const { resource, locale } = action.payload
      const existingApiResource = getAPIResource(state, resource.__typename, resource.id, locale)

      if (deepEqual(existingApiResource, resource)) return state

      return new Map(state).set(
        resource.__typename,
        new Map(state.get(resource.__typename)!).set(
          compositeId(resource.id, resource.__typename, locale),
          resource,
        ),
      )
    }

    case ActionTypes.EVICT_API_RESOURCE: {
      const { id, locale } = action.payload
      const [resourceType, resourceId] = id.split(':')

      if (!isValidAPIResourceType(resourceType)) return state

      const resources = new Map(state.get(resourceType as APIResourceType)!)

      const deleted = resources.delete(compositeId(resourceId, resourceType, locale))

      return deleted ? new Map(state).set(resourceType as APIResourceType, resources) : state
    }

    default:
      return state
  }
}
