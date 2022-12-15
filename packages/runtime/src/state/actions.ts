import type { Operation } from 'ot-json0'

import type { Document } from './modules/read-only-documents'
import type { ComponentType } from './modules/react-components'
import type { Measurable, BoxModel } from './modules/box-models'
import type { ThunkAction } from 'redux-thunk'
import { ComponentMeta } from './modules/components-meta'
import { PropControllerDescriptor } from '../prop-controllers'
import type { Size } from './react-builder-preview'
import type { PropControllersHandle } from './modules/prop-controller-handles'
import type { PropController, PropControllerMessage } from '../prop-controllers/instances'
import type { APIResource } from '../api/types'
import type { SerializedControl } from '../builder'

export const ActionTypes = {
  INIT: 'INIT',
  CLEAN_UP: 'CLEAN_UP',

  REGISTER_DOCUMENT: 'REGISTER_DOCUMENT',
  UNREGISTER_DOCUMENT: 'UNREGISTER_DOCUMENT',

  CHANGE_DOCUMENT: 'CHANGE_DOCUMENT',

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
} as const

type InitAction = { type: typeof ActionTypes.INIT }

type CleanUpAction = { type: typeof ActionTypes.CLEAN_UP }

type RegisterDocumentAction = {
  type: typeof ActionTypes.REGISTER_DOCUMENT
  payload: { documentKey: string; document: Document }
}

type UnregisterDocumentAction = {
  type: typeof ActionTypes.UNREGISTER_DOCUMENT
  payload: { documentKey: string }
}

type ChangeDocumentAction = {
  type: typeof ActionTypes.CHANGE_DOCUMENT
  payload: { documentKey: string; operation: Operation }
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
  payload: { documentKey: string; elementKey: string; componentHandle: unknown }
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
    propControllers: Record<string, PropController>
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
  payload: { resource: APIResource }
}

type EvictAPIResourceAction = {
  type: typeof ActionTypes.EVICT_API_RESOURCE
  payload: { id: string }
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

export type Action =
  | InitAction
  | CleanUpAction
  | ChangeDocumentAction
  | RegisterDocumentAction
  | UnregisterDocumentAction
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

export function registerDocumentEffect(
  document: Document,
): ThunkAction<() => void, unknown, unknown, Action> {
  return dispatch => {
    dispatch(registerDocument(document))

    return () => {
      dispatch(unregisterDocument(document.key))
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
  type: string,
  meta: ComponentMeta,
  serializedControls: Record<string, SerializedControl>,
): RegisterBuilderComponentAction {
  return {
    type: ActionTypes.REGISTER_BUILDER_COMPONENT,
    payload: { type, meta, serializedControls },
  }
}

export function unregisterBuilderComponent(type: string): UnregisterBuilderComponentAction {
  return { type: ActionTypes.UNREGISTER_BUILDER_COMPONENT, payload: { type } }
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
  componentHandle: unknown,
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
  componentHandle: unknown,
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
  propControllers: Record<string, PropController>,
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

export function changeApiResource(resource: APIResource): ChangeAPIResourceAction {
  return { type: ActionTypes.CHANGE_API_RESOURCE, payload: { resource } }
}

export function evictApiResource(id: string): EvictAPIResourceAction {
  return { type: ActionTypes.EVICT_API_RESOURCE, payload: { id } }
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
