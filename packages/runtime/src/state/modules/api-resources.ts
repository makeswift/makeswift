import { APIResource, APIResourceType } from '../../api'
import deepEqual from '../../utils/deepEqual'
import { Action, ActionTypes } from '../actions'

type State = Map<APIResourceType, Map<string, APIResource | null>>

export type SerializedState = {
  [key in APIResourceType]?: {
    id: string
    value: Extract<APIResource, { __typename: key }> | null
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
  },
): State {
  return new Map(
    Object.entries(serializedState).map(([apiResourceType, resources]) => [
      apiResourceType,
      new Map(resources.map(({ id, value }) => [id, value])),
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
  }

  Array.from(state.entries()).forEach(([resourceType, resources]) => {
    const particularResourceMap: { id: string; value: any }[] = []

    Array.from(resources.entries()).forEach(([id, value]) => {
      if (value != null) {
        particularResourceMap.push({ id, value })
      }
    })

    resourceMap[resourceType] = particularResourceMap
  })

  return resourceMap
}

export function getHasAPIResource(
  state: State,
  resourceType: APIResourceType,
  resourceId: string,
): boolean {
  return state.get(resourceType)?.has(resourceId) ?? false
}

export function getAPIResource<T extends APIResourceType>(
  state: State,
  resourceType: T,
  resourceId: string,
): Extract<APIResource, { __typename: T }> | null {
  const resource = state.get(resourceType)?.get(resourceId)

  return resource?.__typename === resourceType
    ? (resource as Extract<typeof resource, { __typename: T }>)
    : null
}

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    case ActionTypes.API_RESOURCE_FULFILLED: {
      const { resourceType, resourceId, resource } = action.payload

      return new Map(state).set(
        resourceType,
        new Map(state.get(resourceType)!).set(resourceId, resource),
      )
    }

    case ActionTypes.CHANGE_API_RESOURCE: {
      const existingApiResource = getAPIResource(
        state,
        action.payload.resource.__typename,
        action.payload.resource.id,
      )

      if (deepEqual(existingApiResource, action.payload.resource)) return state

      return new Map(state).set(
        action.payload.resource.__typename,
        new Map(state.get(action.payload.resource.__typename)!).set(
          action.payload.resource.id,
          action.payload.resource,
        ),
      )
    }

    case ActionTypes.EVICT_API_RESOURCE: {
      const [resourceType, resourceId] = action.payload.id.split(':')

      if (!(resourceType in APIResourceType)) return state

      const resources = new Map(state.get(resourceType as APIResourceType)!)

      const deleted = resources.delete(resourceId)

      return deleted ? new Map(state).set(resourceType as APIResourceType, resources) : state
    }

    default:
      return state
  }
}
