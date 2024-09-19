import { APIResourceType, APIResourceLocale, type APIResource } from '../../api'

import deepEqual from '../../utils/deepEqual'
import { Branded } from '../../utils/branded'

import { Action, ActionTypes } from '../actions'

type CompositeResourceId = Branded<string, 'CompositeResourceId'>

function compositeId(resourceId: string, locale?: string | null): CompositeResourceId {
  return (locale != null ? `${resourceId}@${locale}` : resourceId) as CompositeResourceId
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
    Object.entries(serializedState).map(([apiResourceType, resources]) => [
      apiResourceType,
      new Map(resources.map(({ id, value, locale }) => [compositeId(id, locale), value])),
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
  return state.get(resourceType)?.has(compositeId(resourceId, locale)) ?? false
}

export function getAPIResource<T extends APIResourceType>(
  state: State,
  resourceType: T,
  resourceId: string,
  locale?: APIResourceLocale<T>,
): Extract<APIResource, { __typename: T }> | null {
  const resource = state.get(resourceType)?.get(compositeId(resourceId, locale))

  return resource?.__typename === resourceType
    ? (resource as Extract<typeof resource, { __typename: T }>)
    : null
}

export function reducer(state: State = getInitialState(), action: Action): State {
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
          const cid = compositeId(id, locale)
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
        new Map(state.get(resourceType)!).set(compositeId(resourceId, locale), resource),
      )
    }

    case ActionTypes.CHANGE_API_RESOURCE: {
      const { resource, locale } = action.payload
      const existingApiResource = getAPIResource(state, resource.__typename, resource.id, locale)

      if (deepEqual(existingApiResource, resource)) return state

      return new Map(state).set(
        resource.__typename,
        new Map(state.get(resource.__typename)!).set(compositeId(resource.id, locale), resource),
      )
    }

    case ActionTypes.EVICT_API_RESOURCE: {
      const { id, locale } = action.payload
      const [resourceType, resourceId] = id.split(':')

      if (!(resourceType in APIResourceType)) return state

      const resources = new Map(state.get(resourceType as APIResourceType)!)

      const deleted = resources.delete(compositeId(resourceId, locale))

      return deleted ? new Map(state).set(resourceType as APIResourceType, resources) : state
    }

    default:
      return state
  }
}
