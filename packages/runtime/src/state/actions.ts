import type { Operation } from 'ot-json0'

import { ControlInstance } from '@makeswift/controls'

import type { Element, Document } from './modules/read-only-documents'
import type { DescriptorsByComponentType } from './modules/prop-controllers'

import type { ComponentType } from './modules/react-components'
import type { Measurable, BoxModel } from './modules/box-models'
import type { ThunkAction } from 'redux-thunk'
import { ComponentMeta } from './modules/components-meta'
import { PropControllerDescriptor } from '../prop-controllers'
import type { Size } from './react-builder-preview'
import type { PropControllersHandle } from './modules/prop-controller-handles'
import type { PropControllerMessage } from '../prop-controllers/instances'
import type { APIResource, APIResourceType, APIResourceLocale } from '../api/types'
import type { SerializedControl } from '../builder'
import { ElementImperativeHandle } from '../runtimes/react/element-imperative-handle'
import { BuilderEditMode } from './modules/builder-edit-mode'
import type { Point } from './modules/pointer'
import { Breakpoints } from './modules/breakpoints'
import { type SerializedState as APIClientCache } from './makeswift-api-client'
import { LocaleString, localeStringSchema } from '../locale'

export const ActionTypes = {
  INIT: 'INIT',
  CLEAN_UP: 'CLEAN_UP',

  REGISTER_DOCUMENT: 'REGISTER_DOCUMENT',
  UNREGISTER_DOCUMENT: 'UNREGISTER_DOCUMENT',
  CHANGE_DOCUMENT: 'CHANGE_DOCUMENT',

  CREATE_ELEMENT_TREE: 'CREATE_ELEMENT_TREE',
  DELETE_ELEMENT_TREE: 'DELETE_ELEMENT_TREE',
  CHANGE_ELEMENT_TREE: 'CHANGE_ELEMENT_TREE',

  REGISTER_BUILDER_DOCUMENT: 'REGISTER_BUILDER_DOCUMENT',
  UNREGISTER_BUILDER_DOCUMENT: 'UNREGISTER_BUILDER_DOCUMENT',

  REGISTER_COMPONENT: 'REGISTER_COMPONENT',
  UNREGISTER_COMPONENT: 'UNREGISTER_COMPONENT',

  REGISTER_BUILDER_COMPONENT: 'REGISTER_BUILDER_COMPONENT',
  UNREGISTER_BUILDER_COMPONENT: 'UNREGISTER_BUILDER_COMPONENT',

  REGISTER_REACT_COMPONENT: 'REGISTER_REACT_COMPONENT',
  UNREGISTER_REACT_COMPONENT: 'UNREGISTER_REACT_COMPONENT',

  MOUNT_COMPONENT: 'MOUNT_COMPONENT',
  UNMOUNT_COMPONENT: 'UNMOUNT_COMPONENT',

  REGISTER_COMPONENT_HANDLE: 'REGISTER_COMPONENT_HANDLE',
  UNREGISTER_COMPONENT_HANDLE: 'UNREGISTER_COMPONENT_HANDLE',

  REGISTER_MEASURABLE: 'REGISTER_MEASURABLE',
  UNREGISTER_MEASURABLE: 'UNREGISTER_MEASURABLE',

  CHANGE_ELEMENT_BOX_MODELS: 'CHANGE_ELEMENT_BOX_MODELS',

  CHANGE_DOCUMENT_ELEMENT_SIZE: 'CHANGE_DOCUMENT_ELEMENT_SIZE',
  CHANGE_DOCUMENT_ELEMENT_SCROLL_TOP: 'CHANGE_DOCUMENT_ELEMENT_SCROLL_TOP',
  SCROLL_DOCUMENT_ELEMENT: 'SCROLL_DOCUMENT_ELEMENT',

  REGISTER_PROP_CONTROLLERS_HANDLE: 'REGISTER_PROP_CONTROLLERS_HANDLE',
  UNREGISTER_PROP_CONTROLLERS_HANDLE: 'UNREGISTER_PROP_CONTROLLERS_HANDLE',
  REGISTER_PROP_CONTROLLERS: 'REGISTER_PROP_CONTROLLERS',
  UNREGISTER_PROP_CONTROLLERS: 'UNREGISTER_PROP_CONTROLLERS',
  MESSAGE_HOST_PROP_CONTROLLER: 'MESSAGE_HOST_PROP_CONTROLLER',
  MESSAGE_BUILDER_PROP_CONTROLLER: 'MESSAGE_BUILDER_PROP_CONTROLLER',

  CHANGE_API_RESOURCE: 'CHANGE_API_RESOURCE',
  EVICT_API_RESOURCE: 'EVICT_API_RESOURCE',

  SET_IS_IN_BUILDER: 'SET_IS_IN_BUILDER',

  HANDLE_WHEEL: 'HANDLE_WHEEL',
  HANDLE_POINTER_MOVE: 'HANDLE_POINTER_MOVE',

  API_RESOURCE_FULFILLED: 'API_RESOURCE_FULFILLED',

  SET_BUILDER_EDIT_MODE: 'SET_BUILDER_EDIT_MODE',
  MAKESWIFT_CONNECTION_INIT: 'MAKESWIFT_CONNECTION_INIT',
  MAKESWIFT_CONNECTION_CHECK: 'MAKESWIFT_CONNECTION_CHECK',

  BUILDER_POINTER_MOVE: 'BUILDER_POINTER_MOVE',
  ELEMENT_FROM_POINT_CHANGE: 'ELEMENT_FROM_POINT_CHANGE',

  SET_BREAKPOINTS: 'SET_BREAKPOINTS',

  SET_LOCALE: 'SET_LOCALE',

  SET_LOCALIZED_RESOURCE_ID: 'SET_LOCALIZED_RESOURCE_ID',

  UPDATE_API_CLIENT_CACHE: 'UPDATE_API_CLIENT_CACHE',
} as const

type InitAction = { type: typeof ActionTypes.INIT }

type CleanUpAction = { type: typeof ActionTypes.CLEAN_UP }

type DocumentPayload = {
  key: string
  rootElement: Element
  locale?: string | null // older versions of the runtime may not provide this field
}

type RegisterDocumentAction = {
  type: typeof ActionTypes.REGISTER_DOCUMENT
  payload: { documentKey: string; document: DocumentPayload }
}

type UnregisterDocumentAction = {
  type: typeof ActionTypes.UNREGISTER_DOCUMENT
  payload: { documentKey: string }
}

type ChangeDocumentAction = {
  type: typeof ActionTypes.CHANGE_DOCUMENT
  payload: { documentKey: string; operation: Operation }
}

type CreateElementTreeAction = {
  type: typeof ActionTypes.CREATE_ELEMENT_TREE
  payload: { document: DocumentPayload; descriptors: DescriptorsByComponentType }
}

type DeleteElementTreeAction = {
  type: typeof ActionTypes.DELETE_ELEMENT_TREE
  payload: { documentKey: string }
}

type ChangeElementTreeAction = {
  type: typeof ActionTypes.CHANGE_ELEMENT_TREE
  payload: {
    oldDocument: DocumentPayload
    newDocument: DocumentPayload
    descriptors: DescriptorsByComponentType
    operation: Operation
  }
}

type RegisterBuilderDocumentAction = {
  type: typeof ActionTypes.REGISTER_BUILDER_DOCUMENT
  payload: { documentKey: string; document: DocumentPayload }
}

type UnregisterBuilderDocumentAction = {
  type: typeof ActionTypes.UNREGISTER_BUILDER_DOCUMENT
  payload: { documentKey: string }
}

type RegisterComponentAction = {
  type: typeof ActionTypes.REGISTER_COMPONENT
  payload: {
    type: string
    meta: ComponentMeta
    propControllerDescriptors: Record<string, PropControllerDescriptor>
  }
}

type UnregisterComponentAction = {
  type: typeof ActionTypes.UNREGISTER_COMPONENT
  payload: { type: string }
}

type RegisterBuilderComponentAction = {
  type: typeof ActionTypes.REGISTER_BUILDER_COMPONENT
  payload: {
    type: string
    meta: ComponentMeta
    serializedControls: Record<string, SerializedControl>
  }
  transferables?: Transferable[]
}

type UnregisterBuilderComponentAction = {
  type: typeof ActionTypes.UNREGISTER_BUILDER_COMPONENT
  payload: { type: string }
}

type RegisterReactComponentAction = {
  type: typeof ActionTypes.REGISTER_REACT_COMPONENT
  payload: { type: string; component: ComponentType }
}

type UnregisterReactComponentAction = {
  type: typeof ActionTypes.UNREGISTER_REACT_COMPONENT
  payload: { type: string }
}

type MountComponentAction = {
  type: typeof ActionTypes.MOUNT_COMPONENT
  payload: { documentKey: string; elementKey: string }
}

type UnmountComponentAction = {
  type: typeof ActionTypes.UNMOUNT_COMPONENT
  payload: { documentKey: string; elementKey: string }
}

type RegisterComponentHandleAction = {
  type: typeof ActionTypes.REGISTER_COMPONENT_HANDLE
  payload: { documentKey: string; elementKey: string; componentHandle: ElementImperativeHandle }
}

type UnregisterComponentHandleAction = {
  type: typeof ActionTypes.UNREGISTER_COMPONENT_HANDLE
  payload: { documentKey: string; elementKey: string }
}

type RegisterMeasurableAction = {
  type: typeof ActionTypes.REGISTER_MEASURABLE
  payload: { documentKey: string; elementKey: string; measurable: Measurable }
}

type UnregisterMeasurableAction = {
  type: typeof ActionTypes.UNREGISTER_MEASURABLE
  payload: { documentKey: string; elementKey: string }
}

type ChangeElementBoxModelsAction = {
  type: typeof ActionTypes.CHANGE_ELEMENT_BOX_MODELS
  payload: { changedElementBoxModels: Map<string, Map<string, BoxModel | null>> }
}

type ChangeDocumentElementSizeAction = {
  type: typeof ActionTypes.CHANGE_DOCUMENT_ELEMENT_SIZE
  payload: { size: Size }
}

type ChangeDocumentElementScrollTopAction = {
  type: typeof ActionTypes.CHANGE_DOCUMENT_ELEMENT_SCROLL_TOP
  payload: { scrollTop: number }
}

type ScrollDocumentElementAction = {
  type: typeof ActionTypes.SCROLL_DOCUMENT_ELEMENT
  payload: { scrollTopDelta: number }
}

type RegisterPropControllersHandleAction = {
  type: typeof ActionTypes.REGISTER_PROP_CONTROLLERS_HANDLE
  payload: { documentKey: string; elementKey: string; handle: PropControllersHandle }
}

type UnregisterPropControllersHandleAction = {
  type: typeof ActionTypes.UNREGISTER_PROP_CONTROLLERS_HANDLE
  payload: { documentKey: string; elementKey: string }
}

type RegisterPropControllersAction = {
  type: typeof ActionTypes.REGISTER_PROP_CONTROLLERS
  payload: {
    documentKey: string
    elementKey: string
    propControllers: Record<string, ControlInstance>
  }
}

type UnregisterPropControllersAction = {
  type: typeof ActionTypes.UNREGISTER_PROP_CONTROLLERS
  payload: { documentKey: string; elementKey: string }
}

type MessageHostPropControllerAction<T = PropControllerMessage> = {
  type: typeof ActionTypes.MESSAGE_HOST_PROP_CONTROLLER
  payload: { documentKey: string; elementKey: string; propName: string; message: T }
}

type MessageBuilderPropControllerAction<T = PropControllerMessage> = {
  type: typeof ActionTypes.MESSAGE_BUILDER_PROP_CONTROLLER
  payload: { documentKey: string; elementKey: string; propName: string; message: T }
}

type ChangeAPIResourceAction = {
  type: typeof ActionTypes.CHANGE_API_RESOURCE
  payload: { resource: APIResource; locale?: string | null }
}

type EvictAPIResourceAction = {
  type: typeof ActionTypes.EVICT_API_RESOURCE
  payload: { id: string; locale?: string | null }
}

type SetIsInBuilderAction = {
  type: typeof ActionTypes.SET_IS_IN_BUILDER
  payload: boolean
}

type HandleWheelAction = {
  type: typeof ActionTypes.HANDLE_WHEEL
  payload: { deltaX: number; deltaY: number }
}

type HandlePointerMoveAction = {
  type: typeof ActionTypes.HANDLE_POINTER_MOVE
  payload: { clientX: number; clientY: number }
}

type APIResourceFulfilledAction = {
  type: typeof ActionTypes.API_RESOURCE_FULFILLED
  payload: {
    resourceType: APIResourceType
    resourceId: string
    resource: APIResource | null
    locale?: string | null
  }
}

type SetBuilderEditModeAction = {
  type: typeof ActionTypes.SET_BUILDER_EDIT_MODE
  payload: { editMode: BuilderEditMode }
}

type BuilderPointerMoveAction = {
  type: typeof ActionTypes.BUILDER_POINTER_MOVE
  payload: { pointer: Point | null }
}

type ElementFromPointChangeAction = {
  type: typeof ActionTypes.ELEMENT_FROM_POINT_CHANGE
  payload: { keys: { documentKey: string; elementKey: string } | null }
}

export type SetBreakpointsAction = {
  type: typeof ActionTypes.SET_BREAKPOINTS
  payload: { breakpoints: Breakpoints }
}

type SetLocaleAction = {
  type: typeof ActionTypes.SET_LOCALE
  payload: { locale: LocaleString; pathname?: string }
}

type SetLocalizedResourceIdAction = {
  type: typeof ActionTypes.SET_LOCALIZED_RESOURCE_ID
  // TODO: make `locale` required once we've upgraded the builder to always provide it
  payload: { locale?: string; resourceId: string; localizedResourceId: string | null }
}

type UpdateAPIClientCache = {
  type: typeof ActionTypes.UPDATE_API_CLIENT_CACHE
  payload: APIClientCache
}

export type Action =
  | InitAction
  | CleanUpAction
  | RegisterDocumentAction
  | UnregisterDocumentAction
  | ChangeDocumentAction
  | CreateElementTreeAction
  | DeleteElementTreeAction
  | ChangeElementTreeAction
  | RegisterBuilderDocumentAction
  | UnregisterBuilderDocumentAction
  | RegisterComponentAction
  | UnregisterComponentAction
  | RegisterBuilderComponentAction
  | UnregisterBuilderComponentAction
  | RegisterReactComponentAction
  | UnregisterReactComponentAction
  | MountComponentAction
  | UnmountComponentAction
  | RegisterComponentHandleAction
  | UnregisterComponentHandleAction
  | RegisterMeasurableAction
  | UnregisterMeasurableAction
  | ChangeElementBoxModelsAction
  | ChangeDocumentElementSizeAction
  | ChangeDocumentElementScrollTopAction
  | ScrollDocumentElementAction
  | RegisterPropControllersHandleAction
  | UnregisterPropControllersHandleAction
  | RegisterPropControllersAction
  | UnregisterPropControllersAction
  | MessageHostPropControllerAction
  | MessageBuilderPropControllerAction
  | ChangeAPIResourceAction
  | EvictAPIResourceAction
  | SetIsInBuilderAction
  | HandleWheelAction
  | HandlePointerMoveAction
  | APIResourceFulfilledAction
  | SetBuilderEditModeAction
  | BuilderPointerMoveAction
  | ElementFromPointChangeAction
  | SetBreakpointsAction
  | SetLocaleAction
  | SetLocalizedResourceIdAction
  | UpdateAPIClientCache

export function init(): InitAction {
  return { type: ActionTypes.INIT }
}

export function cleanUp(): CleanUpAction {
  return { type: ActionTypes.CLEAN_UP }
}

export function registerDocument(document: Document): RegisterDocumentAction {
  return { type: ActionTypes.REGISTER_DOCUMENT, payload: { documentKey: document.key, document } }
}

export function unregisterDocument(documentKey: string): UnregisterDocumentAction {
  return { type: ActionTypes.UNREGISTER_DOCUMENT, payload: { documentKey } }
}

export function createElementTree(
  payload: CreateElementTreeAction['payload'],
): CreateElementTreeAction {
  return {
    type: ActionTypes.CREATE_ELEMENT_TREE,
    payload,
  }
}

export function deleteElementTree(
  payload: DeleteElementTreeAction['payload'],
): DeleteElementTreeAction {
  return { type: ActionTypes.DELETE_ELEMENT_TREE, payload }
}

export function changeElementTree(
  payload: ChangeElementTreeAction['payload'],
): ChangeElementTreeAction {
  return {
    type: ActionTypes.CHANGE_ELEMENT_TREE,
    payload,
  }
}

export function registerBuilderDocument(document: Document): RegisterBuilderDocumentAction {
  return {
    type: ActionTypes.REGISTER_BUILDER_DOCUMENT,
    payload: { documentKey: document.key, document },
  }
}

export function unregisterBuilderDocument(documentKey: string): UnregisterBuilderDocumentAction {
  return { type: ActionTypes.UNREGISTER_BUILDER_DOCUMENT, payload: { documentKey } }
}

export function registerDocumentsEffect(
  documents: Document[],
): ThunkAction<() => void, unknown, unknown, Action> {
  return dispatch => {
    documents.forEach(document => dispatch(registerDocument(document)))

    return () => {
      documents.forEach(document => dispatch(unregisterDocument(document.key)))
    }
  }
}

export function changeDocument(documentKey: string, operation: Operation): ChangeDocumentAction {
  return { type: ActionTypes.CHANGE_DOCUMENT, payload: { documentKey, operation } }
}

export function registerComponent(
  type: string,
  meta: ComponentMeta,
  propControllerDescriptors: Record<string, PropControllerDescriptor>,
): RegisterComponentAction {
  return {
    type: ActionTypes.REGISTER_COMPONENT,
    payload: { type, meta, propControllerDescriptors },
  }
}

export function unregisterComponent(type: string): UnregisterComponentAction {
  return { type: ActionTypes.UNREGISTER_COMPONENT, payload: { type } }
}

export function registerComponentEffect(
  type: string,
  meta: ComponentMeta,
  propControllerDescriptors: Record<string, PropControllerDescriptor>,
): ThunkAction<() => void, unknown, unknown, Action> {
  return dispatch => {
    dispatch(registerComponent(type, meta, propControllerDescriptors))

    return () => {
      dispatch(unregisterComponent(type))
    }
  }
}

export function registerBuilderComponent(
  payload: RegisterBuilderComponentAction['payload'],
  transferables?: Transferable[],
): RegisterBuilderComponentAction {
  return {
    type: ActionTypes.REGISTER_BUILDER_COMPONENT,
    payload,
    transferables,
  }
}

export function unregisterBuilderComponent(
  payload: UnregisterBuilderComponentAction['payload'],
): UnregisterBuilderComponentAction {
  return { type: ActionTypes.UNREGISTER_BUILDER_COMPONENT, payload }
}

function registerReactComponent(
  type: string,
  component: ComponentType,
): RegisterReactComponentAction {
  return { type: ActionTypes.REGISTER_REACT_COMPONENT, payload: { type, component } }
}

function unregisterReactComponent(type: string): UnregisterReactComponentAction {
  return { type: ActionTypes.UNREGISTER_REACT_COMPONENT, payload: { type } }
}

export function registerReactComponentEffect(
  type: string,
  component: ComponentType,
): ThunkAction<() => void, unknown, unknown, Action> {
  return dispatch => {
    dispatch(registerReactComponent(type, component))

    return () => {
      dispatch(unregisterReactComponent(type))
    }
  }
}

export function mountComponent(documentKey: string, elementKey: string): MountComponentAction {
  return { type: ActionTypes.MOUNT_COMPONENT, payload: { documentKey, elementKey } }
}

export function unmountComponent(documentKey: string, elementKey: string): UnmountComponentAction {
  return { type: ActionTypes.UNMOUNT_COMPONENT, payload: { documentKey, elementKey } }
}

export function mountComponentEffect(
  documentKey: string,
  elementKey: string,
): ThunkAction<() => void, unknown, unknown, Action> {
  return dispatch => {
    dispatch(mountComponent(documentKey, elementKey))

    return () => {
      dispatch(unmountComponent(documentKey, elementKey))
    }
  }
}

export function registerComponentHandle(
  documentKey: string,
  elementKey: string,
  componentHandle: ElementImperativeHandle,
): RegisterComponentHandleAction {
  return {
    type: ActionTypes.REGISTER_COMPONENT_HANDLE,
    payload: { documentKey, elementKey, componentHandle },
  }
}

function unregisterComponentHandle(
  documentKey: string,
  elementKey: string,
): UnregisterComponentHandleAction {
  return { type: ActionTypes.UNREGISTER_COMPONENT_HANDLE, payload: { documentKey, elementKey } }
}

export function registerComponentHandleEffect(
  documentKey: string,
  elementKey: string,
  componentHandle: ElementImperativeHandle,
): ThunkAction<() => void, unknown, unknown, Action> {
  return dispatch => {
    dispatch(registerComponentHandle(documentKey, elementKey, componentHandle))

    return () => {
      dispatch(unregisterComponentHandle(documentKey, elementKey))
    }
  }
}

export function registerMeasurable(
  documentKey: string,
  elementKey: string,
  measurable: Measurable,
): RegisterMeasurableAction {
  return { type: ActionTypes.REGISTER_MEASURABLE, payload: { documentKey, elementKey, measurable } }
}

export function unregisterMeasurable(
  documentKey: string,
  elementKey: string,
): UnregisterMeasurableAction {
  return { type: ActionTypes.UNREGISTER_MEASURABLE, payload: { documentKey, elementKey } }
}

export function registerMeasurableEffect(
  documentKey: string,
  elementKey: string,
  measurable: Measurable,
): ThunkAction<() => void, unknown, unknown, Action> {
  return dispatch => {
    dispatch(registerMeasurable(documentKey, elementKey, measurable))

    return () => {
      dispatch(unregisterMeasurable(documentKey, elementKey))
    }
  }
}

export function changeElementBoxModels(
  changedElementBoxModels: Map<string, Map<string, BoxModel | null>>,
): ChangeElementBoxModelsAction {
  return { type: ActionTypes.CHANGE_ELEMENT_BOX_MODELS, payload: { changedElementBoxModels } }
}

export function changeDocumentElementSize(size: Size): ChangeDocumentElementSizeAction {
  return { type: ActionTypes.CHANGE_DOCUMENT_ELEMENT_SIZE, payload: { size } }
}

export function changeDocumentElementScrollTop(
  scrollTop: number,
): ChangeDocumentElementScrollTopAction {
  return { type: ActionTypes.CHANGE_DOCUMENT_ELEMENT_SCROLL_TOP, payload: { scrollTop } }
}

export function scrollDocumentElement(scrollTopDelta: number): ScrollDocumentElementAction {
  return { type: ActionTypes.SCROLL_DOCUMENT_ELEMENT, payload: { scrollTopDelta } }
}

export function registerPropControllersHandle(
  documentKey: string,
  elementKey: string,
  handle: PropControllersHandle,
): RegisterPropControllersHandleAction {
  return {
    type: ActionTypes.REGISTER_PROP_CONTROLLERS_HANDLE,
    payload: { documentKey, elementKey, handle },
  }
}

export function unregisterPropControllersHandle(
  documentKey: string,
  elementKey: string,
): UnregisterPropControllersHandleAction {
  return {
    type: ActionTypes.UNREGISTER_PROP_CONTROLLERS_HANDLE,
    payload: { documentKey, elementKey },
  }
}

export function registerPropControllers(
  documentKey: string,
  elementKey: string,
  propControllers: Record<string, ControlInstance>,
): RegisterPropControllersAction {
  return {
    type: ActionTypes.REGISTER_PROP_CONTROLLERS,
    payload: { documentKey, elementKey, propControllers },
  }
}

export function unregisterPropControllers(
  documentKey: string,
  elementKey: string,
): UnregisterPropControllersAction {
  return { type: ActionTypes.UNREGISTER_PROP_CONTROLLERS, payload: { documentKey, elementKey } }
}

export function messageHostPropController<T>(
  documentKey: string,
  elementKey: string,
  propName: string,
  message: T,
): MessageHostPropControllerAction<T> {
  return {
    type: ActionTypes.MESSAGE_HOST_PROP_CONTROLLER,
    payload: { documentKey, elementKey, propName, message },
  }
}

export function messageBuilderPropController<T>(
  documentKey: string,
  elementKey: string,
  propName: string,
  message: T,
): MessageBuilderPropControllerAction<T> {
  return {
    type: ActionTypes.MESSAGE_BUILDER_PROP_CONTROLLER,
    payload: { documentKey, elementKey, propName, message },
  }
}

export function changeApiResource<R extends APIResource>(
  resource: R,
  locale?: APIResourceLocale<R>,
): ChangeAPIResourceAction {
  return { type: ActionTypes.CHANGE_API_RESOURCE, payload: { resource, locale } }
}

export function evictApiResource(id: string, locale?: string | null): EvictAPIResourceAction {
  return { type: ActionTypes.EVICT_API_RESOURCE, payload: { id, locale } }
}

export function setIsInBuilder(isInBuilder: boolean): SetIsInBuilderAction {
  return { type: ActionTypes.SET_IS_IN_BUILDER, payload: isInBuilder }
}

export function handleWheel(payload: { deltaX: number; deltaY: number }): HandleWheelAction {
  return { type: ActionTypes.HANDLE_WHEEL, payload }
}

export function handlePointerMove(payload: {
  clientX: number
  clientY: number
}): HandlePointerMoveAction {
  return { type: ActionTypes.HANDLE_POINTER_MOVE, payload }
}

export function apiResourceFulfilled<T extends APIResourceType>(
  resourceType: T,
  resourceId: string,
  resource: APIResource | null,
  locale?: APIResourceLocale<T>,
): APIResourceFulfilledAction {
  return {
    type: ActionTypes.API_RESOURCE_FULFILLED,
    payload: { resourceType, resourceId, resource, locale },
  }
}

export function setBuilderEditMode(editMode: BuilderEditMode): SetBuilderEditModeAction {
  return {
    type: ActionTypes.SET_BUILDER_EDIT_MODE,
    payload: { editMode },
  }
}

export function builderPointerMove(pointer: Point | null): BuilderPointerMoveAction {
  return { type: ActionTypes.BUILDER_POINTER_MOVE, payload: { pointer } }
}

export function elementFromPointChange(
  keys: {
    documentKey: string
    elementKey: string
  } | null,
): ElementFromPointChangeAction {
  return { type: ActionTypes.ELEMENT_FROM_POINT_CHANGE, payload: { keys } }
}

export function setBreakpoints(breakpoints: Breakpoints): SetBreakpointsAction {
  return { type: ActionTypes.SET_BREAKPOINTS, payload: { breakpoints } }
}

export function setLocale(locale: Intl.Locale, pathname?: string): SetLocaleAction {
  return {
    type: ActionTypes.SET_LOCALE,
    payload: { locale: localeStringSchema.parse(locale.toString()), pathname },
  }
}

export function setLocalizedResourceId({
  resourceId,
  localizedResourceId,
  locale,
}: {
  resourceId: string
  localizedResourceId: string | null
  locale?: string
}): SetLocalizedResourceIdAction {
  return {
    type: ActionTypes.SET_LOCALIZED_RESOURCE_ID,
    payload: { resourceId, localizedResourceId, locale },
  }
}

export function updateAPIClientCache(payload: APIClientCache): UpdateAPIClientCache {
  return { type: ActionTypes.UPDATE_API_CLIENT_CACHE, payload }
}
