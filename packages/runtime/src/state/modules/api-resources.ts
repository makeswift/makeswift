import {
  APIResource,
  APIResourceType,
  Swatch,
  Typography,
  PagePathnameSlice,
  GlobalElement,
  Table,
} from '../../api'
import { fileToFileSnapshot, IdSpecified, MakeswiftSnapshotResources } from '../../next/snapshots'
import deepEqual from '../../utils/deepEqual'
import { Action, ActionTypes } from '../actions'

type State = Map<APIResourceType, Map<string, APIResource | null>>

export type SerializedState = {
  [key in APIResourceType]: { id: string; value: APIResource }[]
}

function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value != null
}

// If we change SerializedState, update this function as well
export function getSnapshotResourcesFromSerializedState(
  serializedState: SerializedState,
): Partial<MakeswiftSnapshotResources> {
  // @note: remember TS is structurally typed, so extra parameters will come into the
  //        objects coming out of this function. That's fine.
  const resources: Partial<MakeswiftSnapshotResources> = {
    swatches: serializedState.Swatch.filter((_): _ is IdSpecified<Swatch> => true),
    typographies: serializedState.Typography.filter((_): _ is IdSpecified<Typography> => true),
    files: serializedState.File.map(({ id, value }) =>
      value.__typename === APIResourceType.File ? { id, value: fileToFileSnapshot(value) } : null,
    ).filter(isNonNullable),
    tables: serializedState.Table.filter((_): _ is IdSpecified<Table> => true),
    pagePathnameSlices: serializedState.PagePathnameSlice.filter(
      (_): _ is IdSpecified<PagePathnameSlice> => true,
    ),
    globalElements: serializedState.GlobalElement.filter(
      (_): _ is IdSpecified<GlobalElement> => true,
    ),
  }

  return resources
}

// @todo: write the reverse function, going from `MakeswiftSnapshotResources` to `SerializedState`
//        it is critical that the two are untied from each other, otherwise
//        we can no longer change `SerializedState`

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
    Object.entries(serializedState).map(
      ([apiResourceType, resources]) =>
        [
          apiResourceType,
          new Map(resources.map(({ id, value }) => [id, value] as [string, APIResource])),
        ] as [APIResourceType, Map<string, APIResource>],
    ),
  )
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
