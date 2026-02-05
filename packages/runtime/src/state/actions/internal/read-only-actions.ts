import { type ThunkAction } from '@reduxjs/toolkit'

import { ControlInstance } from '@makeswift/controls'

import { ElementImperativeHandle } from '../../../runtimes/react/element-imperative-handle'

import { type APIResource, APIResourceType, APIResourceLocale } from '../../../api/types'
import { type SiteVersion } from '../../../api/site-version'
import { type Descriptor as PropControllerDescriptor } from '../../../prop-controllers/descriptors'

import { type ComponentMeta } from '../../modules/components-meta'
import { type PropControllersHandle } from '../../modules/prop-controller-handles'
import { type ComponentType } from '../../modules/react-components'
import { type DescriptorsByComponentType } from '../../modules/prop-controllers'

import { type DocumentPayload } from '../../shared-api'

export const ReadOnlyActionTypes = {
  // TODO: this one should be a read-write action and we should refuse
  // to fetch resources on the client in read-only mode
  API_RESOURCE_FULFILLED: 'API_RESOURCE_FULFILLED',

  CREATE_ELEMENT_TREE: 'CREATE_ELEMENT_TREE',
  DELETE_ELEMENT_TREE: 'DELETE_ELEMENT_TREE',

  REGISTER_COMPONENT: 'REGISTER_COMPONENT',
  UNREGISTER_COMPONENT: 'UNREGISTER_COMPONENT',
  REGISTER_COMPONENT_HANDLE: 'REGISTER_COMPONENT_HANDLE',
  UNREGISTER_COMPONENT_HANDLE: 'UNREGISTER_COMPONENT_HANDLE',

  REGISTER_PROP_CONTROLLERS: 'REGISTER_PROP_CONTROLLERS',
  UNREGISTER_PROP_CONTROLLERS: 'UNREGISTER_PROP_CONTROLLERS',
  REGISTER_PROP_CONTROLLERS_HANDLE: 'REGISTER_PROP_CONTROLLERS_HANDLE',
  UNREGISTER_PROP_CONTROLLERS_HANDLE: 'UNREGISTER_PROP_CONTROLLERS_HANDLE',

  REGISTER_REACT_COMPONENT: 'REGISTER_REACT_COMPONENT',
  UNREGISTER_REACT_COMPONENT: 'UNREGISTER_REACT_COMPONENT',

  SET_IS_IN_BUILDER: 'SET_IS_IN_BUILDER',
  SET_IS_READ_ONLY: 'SET_IS_READ_ONLY',
  SET_SITE_VERSION: 'SET_SITE_VERSION',

  // TODO: consolidate with `SET_LOCALE` action in `shared-api.ts`
  // (requires changes to the builder to handle null locales)
  RESET_LOCALE_STATE: 'RESET_LOCALE_STATE',
} as const

type APIResourceFulfilledAction = {
  type: typeof ReadOnlyActionTypes.API_RESOURCE_FULFILLED
  payload: {
    resourceType: APIResourceType
    resourceId: string
    resource: APIResource | null
    locale?: string | null
  }
}

type CreateElementTreeAction = {
  type: typeof ReadOnlyActionTypes.CREATE_ELEMENT_TREE
  payload: { document: DocumentPayload; descriptors: DescriptorsByComponentType }
}

type DeleteElementTreeAction = {
  type: typeof ReadOnlyActionTypes.DELETE_ELEMENT_TREE
  payload: { documentKey: string }
}

export type RegisterComponentAction = {
  type: typeof ReadOnlyActionTypes.REGISTER_COMPONENT
  payload: {
    type: string
    meta: ComponentMeta
    propControllerDescriptors: Record<string, PropControllerDescriptor>
  }
}

export type UnregisterComponentAction = {
  type: typeof ReadOnlyActionTypes.UNREGISTER_COMPONENT
  payload: { type: string }
}

type RegisterComponentHandleAction = {
  type: typeof ReadOnlyActionTypes.REGISTER_COMPONENT_HANDLE
  payload: { documentKey: string; elementKey: string; componentHandle: ElementImperativeHandle }
}

type UnregisterComponentHandleAction = {
  type: typeof ReadOnlyActionTypes.UNREGISTER_COMPONENT_HANDLE
  payload: { documentKey: string; elementKey: string }
}

type RegisterPropControllersHandleAction = {
  type: typeof ReadOnlyActionTypes.REGISTER_PROP_CONTROLLERS_HANDLE
  payload: { documentKey: string; elementKey: string; handle: PropControllersHandle }
}

type UnregisterPropControllersHandleAction = {
  type: typeof ReadOnlyActionTypes.UNREGISTER_PROP_CONTROLLERS_HANDLE
  payload: { documentKey: string; elementKey: string }
}

type RegisterPropControllersAction = {
  type: typeof ReadOnlyActionTypes.REGISTER_PROP_CONTROLLERS
  payload: {
    documentKey: string
    elementKey: string
    propControllers: Record<string, ControlInstance>
  }
}

type UnregisterPropControllersAction = {
  type: typeof ReadOnlyActionTypes.UNREGISTER_PROP_CONTROLLERS
  payload: { documentKey: string; elementKey: string }
}

type RegisterReactComponentAction = {
  type: typeof ReadOnlyActionTypes.REGISTER_REACT_COMPONENT
  payload: { type: string; component: ComponentType }
}

type UnregisterReactComponentAction = {
  type: typeof ReadOnlyActionTypes.UNREGISTER_REACT_COMPONENT
  payload: { type: string }
}

type SetIsInBuilderAction = {
  type: typeof ReadOnlyActionTypes.SET_IS_IN_BUILDER
  payload: boolean
}

type SetIsReadOnlyAction = {
  type: typeof ReadOnlyActionTypes.SET_IS_READ_ONLY
  payload: boolean
}

type SetSiteVersionAction = {
  type: typeof ReadOnlyActionTypes.SET_SITE_VERSION
  payload: SiteVersion | null
}

type ResetLocaleStateAction = {
  type: typeof ReadOnlyActionTypes.RESET_LOCALE_STATE
}

export type ReadOnlyAction =
  | APIResourceFulfilledAction
  | CreateElementTreeAction
  | DeleteElementTreeAction
  | RegisterComponentAction
  | UnregisterComponentAction
  | RegisterComponentHandleAction
  | UnregisterComponentHandleAction
  | RegisterPropControllersHandleAction
  | UnregisterPropControllersHandleAction
  | RegisterPropControllersAction
  | UnregisterPropControllersAction
  | RegisterReactComponentAction
  | UnregisterReactComponentAction
  | SetIsInBuilderAction
  | SetIsReadOnlyAction
  | SetSiteVersionAction
  | ResetLocaleStateAction

export function apiResourceFulfilled<T extends APIResourceType>(
  resourceType: T,
  resourceId: string,
  resource: APIResource | null,
  locale?: APIResourceLocale<T>,
): APIResourceFulfilledAction {
  return {
    type: ReadOnlyActionTypes.API_RESOURCE_FULFILLED,
    payload: { resourceType, resourceId, resource, locale },
  }
}

export function createElementTree(
  payload: CreateElementTreeAction['payload'],
): CreateElementTreeAction {
  return {
    type: ReadOnlyActionTypes.CREATE_ELEMENT_TREE,
    payload,
  }
}

export function deleteElementTree(
  payload: DeleteElementTreeAction['payload'],
): DeleteElementTreeAction {
  return { type: ReadOnlyActionTypes.DELETE_ELEMENT_TREE, payload }
}

export function registerComponent(
  type: string,
  meta: ComponentMeta,
  propControllerDescriptors: Record<string, PropControllerDescriptor>,
): RegisterComponentAction {
  return {
    type: ReadOnlyActionTypes.REGISTER_COMPONENT,
    payload: { type, meta, propControllerDescriptors },
  }
}

export function unregisterComponent(type: string): UnregisterComponentAction {
  return { type: ReadOnlyActionTypes.UNREGISTER_COMPONENT, payload: { type } }
}

export function registerComponentEffect(
  type: string,
  meta: ComponentMeta,
  propControllerDescriptors: Record<string, PropControllerDescriptor>,
): ThunkAction<() => void, unknown, unknown, ReadOnlyAction> {
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
    type: ReadOnlyActionTypes.REGISTER_COMPONENT_HANDLE,
    payload: { documentKey, elementKey, componentHandle },
  }
}

function unregisterComponentHandle(
  documentKey: string,
  elementKey: string,
): UnregisterComponentHandleAction {
  return {
    type: ReadOnlyActionTypes.UNREGISTER_COMPONENT_HANDLE,
    payload: { documentKey, elementKey },
  }
}

export function registerComponentHandleEffect(
  documentKey: string,
  elementKey: string,
  componentHandle: ElementImperativeHandle,
): ThunkAction<() => void, unknown, unknown, ReadOnlyAction> {
  return dispatch => {
    dispatch(registerComponentHandle(documentKey, elementKey, componentHandle))

    return () => {
      dispatch(unregisterComponentHandle(documentKey, elementKey))
    }
  }
}

export function registerPropControllersHandle(
  documentKey: string,
  elementKey: string,
  handle: PropControllersHandle,
): RegisterPropControllersHandleAction {
  return {
    type: ReadOnlyActionTypes.REGISTER_PROP_CONTROLLERS_HANDLE,
    payload: { documentKey, elementKey, handle },
  }
}

export function unregisterPropControllersHandle(
  documentKey: string,
  elementKey: string,
): UnregisterPropControllersHandleAction {
  return {
    type: ReadOnlyActionTypes.UNREGISTER_PROP_CONTROLLERS_HANDLE,
    payload: { documentKey, elementKey },
  }
}

export function registerPropControllers(
  documentKey: string,
  elementKey: string,
  propControllers: Record<string, ControlInstance>,
): RegisterPropControllersAction {
  return {
    type: ReadOnlyActionTypes.REGISTER_PROP_CONTROLLERS,
    payload: { documentKey, elementKey, propControllers },
  }
}

export function unregisterPropControllers(
  documentKey: string,
  elementKey: string,
): UnregisterPropControllersAction {
  return {
    type: ReadOnlyActionTypes.UNREGISTER_PROP_CONTROLLERS,
    payload: { documentKey, elementKey },
  }
}

function registerReactComponent(
  type: string,
  component: ComponentType,
): RegisterReactComponentAction {
  return { type: ReadOnlyActionTypes.REGISTER_REACT_COMPONENT, payload: { type, component } }
}

function unregisterReactComponent(type: string): UnregisterReactComponentAction {
  return { type: ReadOnlyActionTypes.UNREGISTER_REACT_COMPONENT, payload: { type } }
}

export function registerReactComponentEffect(
  type: string,
  component: ComponentType,
): ThunkAction<() => void, unknown, unknown, ReadOnlyAction> {
  return dispatch => {
    dispatch(registerReactComponent(type, component))

    return () => {
      dispatch(unregisterReactComponent(type))
    }
  }
}

export function setIsInBuilder(isInBuilder: boolean): SetIsInBuilderAction {
  return { type: ReadOnlyActionTypes.SET_IS_IN_BUILDER, payload: isInBuilder }
}

export function setIsReadOnly(isReadOnly: boolean): SetIsReadOnlyAction {
  return { type: ReadOnlyActionTypes.SET_IS_READ_ONLY, payload: isReadOnly }
}

export function setSiteVersion(siteVersion: SiteVersion | null): SetSiteVersionAction {
  return { type: ReadOnlyActionTypes.SET_SITE_VERSION, payload: siteVersion }
}

export function resetLocaleState(): ResetLocaleStateAction {
  return { type: ReadOnlyActionTypes.RESET_LOCALE_STATE }
}
