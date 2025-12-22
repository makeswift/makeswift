import { type Operation } from 'ot-json0'
import { type ThunkAction } from '@reduxjs/toolkit'

import { ControlInstance } from '@makeswift/controls'

import { ElementImperativeHandle } from '../../runtimes/react/element-imperative-handle'

import { type APIResource, APIResourceType, APIResourceLocale } from '../../api/types'
import { type Descriptor as PropControllerDescriptor } from '../../prop-controllers/descriptors'

import { type Measurable } from '../modules/box-models'
import { type ComponentMeta } from '../modules/components-meta'
import { type PropControllersHandle } from '../modules/prop-controller-handles'
import { type ComponentType } from '../modules/react-components'
import { type DescriptorsByComponentType } from '../modules/prop-controllers'

import { type DocumentPayload } from '../shared-api'
import { type SerializedState as APIClientCache } from '../makeswift-api-client'

export const InternalActionTypes = {
  API_RESOURCE_FULFILLED: 'API_RESOURCE_FULFILLED',

  CREATE_ELEMENT_TREE: 'CREATE_ELEMENT_TREE',
  DELETE_ELEMENT_TREE: 'DELETE_ELEMENT_TREE',
  CHANGE_ELEMENT_TREE: 'CHANGE_ELEMENT_TREE',

  REGISTER_COMPONENT: 'REGISTER_COMPONENT',
  UNREGISTER_COMPONENT: 'UNREGISTER_COMPONENT',

  REGISTER_COMPONENT_HANDLE: 'REGISTER_COMPONENT_HANDLE',
  UNREGISTER_COMPONENT_HANDLE: 'UNREGISTER_COMPONENT_HANDLE',

  REGISTER_MEASURABLE: 'REGISTER_MEASURABLE',
  UNREGISTER_MEASURABLE: 'UNREGISTER_MEASURABLE',

  REGISTER_PROP_CONTROLLERS: 'REGISTER_PROP_CONTROLLERS',
  UNREGISTER_PROP_CONTROLLERS: 'UNREGISTER_PROP_CONTROLLERS',

  REGISTER_PROP_CONTROLLERS_HANDLE: 'REGISTER_PROP_CONTROLLERS_HANDLE',
  UNREGISTER_PROP_CONTROLLERS_HANDLE: 'UNREGISTER_PROP_CONTROLLERS_HANDLE',

  REGISTER_REACT_COMPONENT: 'REGISTER_REACT_COMPONENT',
  UNREGISTER_REACT_COMPONENT: 'UNREGISTER_REACT_COMPONENT',

  SET_IS_IN_BUILDER: 'SET_IS_IN_BUILDER',

  UPDATE_API_CLIENT_CACHE: 'UPDATE_API_CLIENT_CACHE',
} as const

type APIResourceFulfilledAction = {
  type: typeof InternalActionTypes.API_RESOURCE_FULFILLED
  payload: {
    resourceType: APIResourceType
    resourceId: string
    resource: APIResource | null
    locale?: string | null
  }
}

type CreateElementTreeAction = {
  type: typeof InternalActionTypes.CREATE_ELEMENT_TREE
  payload: { document: DocumentPayload; descriptors: DescriptorsByComponentType }
}

type DeleteElementTreeAction = {
  type: typeof InternalActionTypes.DELETE_ELEMENT_TREE
  payload: { documentKey: string }
}

type ChangeElementTreeAction = {
  type: typeof InternalActionTypes.CHANGE_ELEMENT_TREE
  payload: {
    oldDocument: DocumentPayload
    newDocument: DocumentPayload
    descriptors: DescriptorsByComponentType
    operation: Operation
  }
}

export type RegisterComponentAction = {
  type: typeof InternalActionTypes.REGISTER_COMPONENT
  payload: {
    type: string
    meta: ComponentMeta
    propControllerDescriptors: Record<string, PropControllerDescriptor>
  }
}

export type UnregisterComponentAction = {
  type: typeof InternalActionTypes.UNREGISTER_COMPONENT
  payload: { type: string }
}

type RegisterComponentHandleAction = {
  type: typeof InternalActionTypes.REGISTER_COMPONENT_HANDLE
  payload: { documentKey: string; elementKey: string; componentHandle: ElementImperativeHandle }
}

type UnregisterComponentHandleAction = {
  type: typeof InternalActionTypes.UNREGISTER_COMPONENT_HANDLE
  payload: { documentKey: string; elementKey: string }
}

type RegisterMeasurableAction = {
  type: typeof InternalActionTypes.REGISTER_MEASURABLE
  payload: { documentKey: string; elementKey: string; measurable: Measurable }
}

type UnregisterMeasurableAction = {
  type: typeof InternalActionTypes.UNREGISTER_MEASURABLE
  payload: { documentKey: string; elementKey: string }
}

type RegisterPropControllersHandleAction = {
  type: typeof InternalActionTypes.REGISTER_PROP_CONTROLLERS_HANDLE
  payload: { documentKey: string; elementKey: string; handle: PropControllersHandle }
}

type UnregisterPropControllersHandleAction = {
  type: typeof InternalActionTypes.UNREGISTER_PROP_CONTROLLERS_HANDLE
  payload: { documentKey: string; elementKey: string }
}

type RegisterPropControllersAction = {
  type: typeof InternalActionTypes.REGISTER_PROP_CONTROLLERS
  payload: {
    documentKey: string
    elementKey: string
    propControllers: Record<string, ControlInstance>
  }
}

type UnregisterPropControllersAction = {
  type: typeof InternalActionTypes.UNREGISTER_PROP_CONTROLLERS
  payload: { documentKey: string; elementKey: string }
}

type RegisterReactComponentAction = {
  type: typeof InternalActionTypes.REGISTER_REACT_COMPONENT
  payload: { type: string; component: ComponentType }
}

type UnregisterReactComponentAction = {
  type: typeof InternalActionTypes.UNREGISTER_REACT_COMPONENT
  payload: { type: string }
}

type SetIsInBuilderAction = {
  type: typeof InternalActionTypes.SET_IS_IN_BUILDER
  payload: boolean
}

type UpdateAPIClientCache = {
  type: typeof InternalActionTypes.UPDATE_API_CLIENT_CACHE
  payload: APIClientCache
}

export type InternalAction =
  | APIResourceFulfilledAction
  | CreateElementTreeAction
  | DeleteElementTreeAction
  | ChangeElementTreeAction
  | RegisterComponentAction
  | UnregisterComponentAction
  | RegisterComponentHandleAction
  | UnregisterComponentHandleAction
  | RegisterMeasurableAction
  | UnregisterMeasurableAction
  | RegisterPropControllersHandleAction
  | UnregisterPropControllersHandleAction
  | RegisterPropControllersAction
  | UnregisterPropControllersAction
  | RegisterReactComponentAction
  | UnregisterReactComponentAction
  | SetIsInBuilderAction
  | UpdateAPIClientCache

export function apiResourceFulfilled<T extends APIResourceType>(
  resourceType: T,
  resourceId: string,
  resource: APIResource | null,
  locale?: APIResourceLocale<T>,
): APIResourceFulfilledAction {
  return {
    type: InternalActionTypes.API_RESOURCE_FULFILLED,
    payload: { resourceType, resourceId, resource, locale },
  }
}

export function createElementTree(
  payload: CreateElementTreeAction['payload'],
): CreateElementTreeAction {
  return {
    type: InternalActionTypes.CREATE_ELEMENT_TREE,
    payload,
  }
}

export function deleteElementTree(
  payload: DeleteElementTreeAction['payload'],
): DeleteElementTreeAction {
  return { type: InternalActionTypes.DELETE_ELEMENT_TREE, payload }
}

export function changeElementTree(
  payload: ChangeElementTreeAction['payload'],
): ChangeElementTreeAction {
  return {
    type: InternalActionTypes.CHANGE_ELEMENT_TREE,
    payload,
  }
}

export function registerComponent(
  type: string,
  meta: ComponentMeta,
  propControllerDescriptors: Record<string, PropControllerDescriptor>,
): RegisterComponentAction {
  return {
    type: InternalActionTypes.REGISTER_COMPONENT,
    payload: { type, meta, propControllerDescriptors },
  }
}

export function unregisterComponent(type: string): UnregisterComponentAction {
  return { type: InternalActionTypes.UNREGISTER_COMPONENT, payload: { type } }
}

export function registerComponentEffect(
  type: string,
  meta: ComponentMeta,
  propControllerDescriptors: Record<string, PropControllerDescriptor>,
): ThunkAction<() => void, unknown, unknown, InternalAction> {
  return dispatch => {
    dispatch(registerComponent(type, meta, propControllerDescriptors))

    return () => {
      dispatch(unregisterComponent(type))
    }
  }
}

export function registerComponentHandle(
  documentKey: string,
  elementKey: string,
  componentHandle: ElementImperativeHandle,
): RegisterComponentHandleAction {
  return {
    type: InternalActionTypes.REGISTER_COMPONENT_HANDLE,
    payload: { documentKey, elementKey, componentHandle },
  }
}

function unregisterComponentHandle(
  documentKey: string,
  elementKey: string,
): UnregisterComponentHandleAction {
  return {
    type: InternalActionTypes.UNREGISTER_COMPONENT_HANDLE,
    payload: { documentKey, elementKey },
  }
}

export function registerComponentHandleEffect(
  documentKey: string,
  elementKey: string,
  componentHandle: ElementImperativeHandle,
): ThunkAction<() => void, unknown, unknown, InternalAction> {
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
  return {
    type: InternalActionTypes.REGISTER_MEASURABLE,
    payload: { documentKey, elementKey, measurable },
  }
}

export function unregisterMeasurable(
  documentKey: string,
  elementKey: string,
): UnregisterMeasurableAction {
  return { type: InternalActionTypes.UNREGISTER_MEASURABLE, payload: { documentKey, elementKey } }
}

export function registerMeasurableEffect(
  documentKey: string,
  elementKey: string,
  measurable: Measurable,
): ThunkAction<() => void, unknown, unknown, InternalAction> {
  return dispatch => {
    dispatch(registerMeasurable(documentKey, elementKey, measurable))

    return () => {
      dispatch(unregisterMeasurable(documentKey, elementKey))
    }
  }
}

export function registerPropControllersHandle(
  documentKey: string,
  elementKey: string,
  handle: PropControllersHandle,
): RegisterPropControllersHandleAction {
  return {
    type: InternalActionTypes.REGISTER_PROP_CONTROLLERS_HANDLE,
    payload: { documentKey, elementKey, handle },
  }
}

export function unregisterPropControllersHandle(
  documentKey: string,
  elementKey: string,
): UnregisterPropControllersHandleAction {
  return {
    type: InternalActionTypes.UNREGISTER_PROP_CONTROLLERS_HANDLE,
    payload: { documentKey, elementKey },
  }
}

export function registerPropControllers(
  documentKey: string,
  elementKey: string,
  propControllers: Record<string, ControlInstance>,
): RegisterPropControllersAction {
  return {
    type: InternalActionTypes.REGISTER_PROP_CONTROLLERS,
    payload: { documentKey, elementKey, propControllers },
  }
}

export function unregisterPropControllers(
  documentKey: string,
  elementKey: string,
): UnregisterPropControllersAction {
  return {
    type: InternalActionTypes.UNREGISTER_PROP_CONTROLLERS,
    payload: { documentKey, elementKey },
  }
}

function registerReactComponent(
  type: string,
  component: ComponentType,
): RegisterReactComponentAction {
  return { type: InternalActionTypes.REGISTER_REACT_COMPONENT, payload: { type, component } }
}

function unregisterReactComponent(type: string): UnregisterReactComponentAction {
  return { type: InternalActionTypes.UNREGISTER_REACT_COMPONENT, payload: { type } }
}

export function registerReactComponentEffect(
  type: string,
  component: ComponentType,
): ThunkAction<() => void, unknown, unknown, InternalAction> {
  return dispatch => {
    dispatch(registerReactComponent(type, component))

    return () => {
      dispatch(unregisterReactComponent(type))
    }
  }
}

export function setIsInBuilder(isInBuilder: boolean): SetIsInBuilderAction {
  return { type: InternalActionTypes.SET_IS_IN_BUILDER, payload: isInBuilder }
}

export function updateAPIClientCache(payload: APIClientCache): UpdateAPIClientCache {
  return { type: InternalActionTypes.UPDATE_API_CLIENT_CACHE, payload }
}
