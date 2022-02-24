import type { Operation } from 'ot-json0'

import type { ComponentType } from './modules/react-components'
import type { Measurable, BoxModel } from './modules/box-models'
import type { ThunkAction } from 'redux-thunk'
import { ComponentMeta } from './modules/components-meta'
import { PropControllerDescriptor } from '../prop-controllers'
import type { Size } from './react-builder-preview'

export const ActionTypes = {
  CHANGE_DOCUMENT: 'CHANGE_DOCUMENT',

  REGISTER_COMPONENT: 'REGISTER_COMPONENT',
  UNREGISTER_COMPONENT: 'UNREGISTER_COMPONENT',

  REGISTER_REACT_COMPONENT: 'REGISTER_REACT_COMPONENT',
  UNREGISTER_REACT_COMPONENT: 'UNREGISTER_REACT_COMPONENT',

  MOUNT_COMPONENT: 'MOUNT_COMPONENT',
  UNMOUNT_COMPONENT: 'UNMOUNT_COMPONENT',

  CHANGE_COMPONENT_HANDLE: 'CHANGE_COMPONENT_HANDLE',

  REGISTER_MEASURABLE: 'REGISTER_MEASURABLE',
  UNREGISTER_MEASURABLE: 'UNREGISTER_MEASURABLE',

  CHANGE_ELEMENT_BOX_MODELS: 'CHANGE_ELEMENT_BOX_MODELS',

  CHANGE_DOCUMENT_ELEMENT_SIZE: 'CHANGE_DOCUMENT_ELEMENT_SIZE',
  CHANGE_DOCUMENT_ELEMENT_SCROLL_TOP: 'CHANGE_DOCUMENT_ELEMENT_SCROLL_TOP',
} as const

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
  payload: { elementKey: string }
}

type UnmountComponentAction = {
  type: typeof ActionTypes.UNMOUNT_COMPONENT
  payload: { elementKey: string }
}

type ChangeComponentHandleAction = {
  type: typeof ActionTypes.CHANGE_COMPONENT_HANDLE
  payload: { elementKey: string; componentHandle: unknown }
}

type RegisterMeasurableAction = {
  type: typeof ActionTypes.REGISTER_MEASURABLE
  payload: { elementKey: string; measurable: Measurable }
}

type UnregisterMeasurableAction = {
  type: typeof ActionTypes.UNREGISTER_MEASURABLE
  payload: { elementKey: string }
}

type ChangeElementBoxModelsAction = {
  type: typeof ActionTypes.CHANGE_ELEMENT_BOX_MODELS
  payload: { changedElementBoxModels: Map<string, BoxModel | null> }
}

type ChangeDocumentElementSizeAction = {
  type: typeof ActionTypes.CHANGE_DOCUMENT_ELEMENT_SIZE
  payload: { size: Size }
}

type ChangeDocumentElementScrollTopAction = {
  type: typeof ActionTypes.CHANGE_DOCUMENT_ELEMENT_SCROLL_TOP
  payload: { scrollTop: number }
}

export type Action =
  | ChangeDocumentAction
  | RegisterComponentAction
  | UnregisterComponentAction
  | RegisterReactComponentAction
  | UnregisterReactComponentAction
  | MountComponentAction
  | UnmountComponentAction
  | ChangeComponentHandleAction
  | RegisterMeasurableAction
  | UnregisterMeasurableAction
  | ChangeElementBoxModelsAction
  | ChangeDocumentElementSizeAction
  | ChangeDocumentElementScrollTopAction

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

export function mountComponent(elementKey: string): MountComponentAction {
  return { type: ActionTypes.MOUNT_COMPONENT, payload: { elementKey } }
}

export function unmountComponent(elementKey: string): UnmountComponentAction {
  return { type: ActionTypes.UNMOUNT_COMPONENT, payload: { elementKey } }
}

export function mountComponentEffect(
  elementKey: string,
): ThunkAction<() => void, unknown, unknown, Action> {
  return dispatch => {
    dispatch(mountComponent(elementKey))

    return () => {
      dispatch(unmountComponent(elementKey))
    }
  }
}

export function changeComponentHandle(
  elementKey: string,
  componentHandle: unknown,
): ChangeComponentHandleAction {
  return { type: ActionTypes.CHANGE_COMPONENT_HANDLE, payload: { elementKey, componentHandle } }
}

export function registerMeasurable(
  elementKey: string,
  measurable: Measurable,
): RegisterMeasurableAction {
  return { type: ActionTypes.REGISTER_MEASURABLE, payload: { elementKey, measurable } }
}

export function unregisterMeasurable(elementKey: string): UnregisterMeasurableAction {
  return { type: ActionTypes.UNREGISTER_MEASURABLE, payload: { elementKey } }
}

export function registerMeasurableEffect(
  elementKey: string,
  measurable: Measurable,
): ThunkAction<() => void, unknown, unknown, Action> {
  return dispatch => {
    dispatch(registerMeasurable(elementKey, measurable))

    return () => {
      dispatch(unregisterMeasurable(elementKey))
    }
  }
}

export function changeElementBoxModels(
  changedElementBoxModels: Map<string, BoxModel | null>,
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
