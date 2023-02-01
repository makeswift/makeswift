import { APIResource, APIResourceType } from '../../api'
import deepEqual from '../../utils/deepEqual'
import { Action, ActionTypes } from '../actions'

type State = Map<APIResourceType, Map<string, APIResource | null>>

type SerializedMap<K, V> = [K, V][]

export type SerializedState = SerializedMap<
  APIResourceType,
  SerializedMap<string, APIResource | null>
>

export function getInitialState(serializedState: SerializedState = []): State {
  return new Map(
    serializedState.map(([resourceType, resources]) => [resourceType, new Map(resources)]),
  )
}

export function getSerializedState(state: State): SerializedState {
  const entries = Array.from(state.entries())
  console.log(`entries: ${JSON.stringify(entries, null, 2)}`)
  return entries.map(([resourceType, resources]) => [resourceType, Array.from(resources.entries())])
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

    case ActionTypes.INTROSPECTED_RESOURCES_FULFILLED: {
      const { introspectedResourceIds, introspectedResources } = action.payload
      const swatches = new Map(state.get(APIResourceType.Swatch)!)
      const files = new Map(state.get(APIResourceType.File)!)
      const typographies = new Map(state.get(APIResourceType.Typography)!)
      const pagePathnameSlices = new Map(state.get(APIResourceType.PagePathnameSlice)!)
      const tables = new Map(state.get(APIResourceType.Table)!)

      introspectedResourceIds.swatchIds.forEach((swatchId, idx) => {
        swatches.set(swatchId, introspectedResources.swatches[idx])
      })
      introspectedResourceIds.fileIds.forEach((fileId, idx) => {
        files.set(fileId, introspectedResources.files[idx])
      })
      introspectedResourceIds.typographyIds.forEach((typographyId, idx) => {
        typographies.set(typographyId, introspectedResources.typographies[idx])
      })
      introspectedResourceIds.pageIds.forEach((pageId, idx) => {
        const pagePathnameSlice = introspectedResources.pagePathnamesById[idx]

        if (pagePathnameSlice == null) {
          pagePathnameSlices.set(pageId, pagePathnameSlice)
        } else {
          // We're doing this because the API return the id without turning it to nodeId:
          // '87237bda-e775-48d8-92cc-399c65577bb7' vs 'UGFnZTo4NzIzN2JkYS1lNzc1LTQ4ZDgtOTJjYy0zOTljNjU1NzdiYjc='
          const nodeId = Buffer.from(`Page:${pagePathnameSlice.id}`).toString('base64')

          pagePathnameSlices.set(nodeId, { ...pagePathnameSlice, id: nodeId })
        }
      })
      introspectedResourceIds.tableIds.forEach((tableId, idx) => {
        tables.set(tableId, introspectedResources.tables[idx])
      })

      return new Map(state)
        .set(APIResourceType.Swatch, swatches)
        .set(APIResourceType.File, files)
        .set(APIResourceType.Typography, typographies)
        .set(APIResourceType.PagePathnameSlice, pagePathnameSlices)
        .set(APIResourceType.Table, tables)
    }

    case ActionTypes.TYPOGRAPHIES_FULFILLED: {
      const typographies = new Map(state.get(APIResourceType.Typography)!)

      action.payload.typographyIds.forEach((typographyId, idx) => {
        typographies.set(typographyId, action.payload.typographies[idx])
      })

      return new Map(state).set(APIResourceType.Typography, typographies)
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
