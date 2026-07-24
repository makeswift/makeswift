import { type ThunkAction } from '@reduxjs/toolkit'

import { type APIResource, APIResourceType, APIResourceLocale } from '../../../api/types'
import { type Descriptor as PropControllerDescriptor } from '../../../prop-controllers/descriptors'

import { type Breakpoints } from '../../modules/breakpoints'
import { type ComponentMeta } from '../../modules/components-meta'
import { type ComponentType } from '../../modules/react-components'
import { type DescriptorsByComponentType } from '../../modules/prop-controller-descriptors'

import { type LocaleString, localeStringSchema } from '../../../locale'
import { type DocumentPayload } from '../../shared-api'

import { ReadOnlyActionTypes } from './read-only-action-types'

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

type RegisterReactComponentAction = {
  type: typeof ReadOnlyActionTypes.REGISTER_REACT_COMPONENT
  payload: { type: string; component: ComponentType }
}

type UnregisterReactComponentAction = {
  type: typeof ReadOnlyActionTypes.UNREGISTER_REACT_COMPONENT
  payload: { type: string }
}

export type SetBreakpointsAction = {
  type: typeof ReadOnlyActionTypes.SET_BREAKPOINTS
  payload: { breakpoints: Breakpoints }
}

type UpdateClientBreakpointAction = {
  type: typeof ReadOnlyActionTypes.UPDATE_CLIENT_BREAKPOINT
}

export type SetLocaleAction = {
  type: typeof ReadOnlyActionTypes.SET_LOCALE
  payload: { locale: LocaleString; pathname?: string }
}

type SetIsInBuilderAction = {
  type: typeof ReadOnlyActionTypes.SET_IS_IN_BUILDER
  payload: boolean
}

type SetIsReadOnlyAction = {
  type: typeof ReadOnlyActionTypes.SET_IS_READ_ONLY
  payload: boolean
}

export type ReadOnlyAction =
  | APIResourceFulfilledAction
  | CreateElementTreeAction
  | DeleteElementTreeAction
  | RegisterComponentAction
  | UnregisterComponentAction
  | RegisterReactComponentAction
  | UnregisterReactComponentAction
  | SetBreakpointsAction
  | UpdateClientBreakpointAction
  | SetLocaleAction
  | SetIsInBuilderAction
  | SetIsReadOnlyAction

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

export function setBreakpoints(breakpoints: Breakpoints): SetBreakpointsAction {
  return { type: ReadOnlyActionTypes.SET_BREAKPOINTS, payload: { breakpoints } }
}

export function updateClientBreakpoint(): UpdateClientBreakpointAction {
  return { type: ReadOnlyActionTypes.UPDATE_CLIENT_BREAKPOINT }
}

export function setLocale(locale: Intl.Locale, pathname?: string): SetLocaleAction {
  return {
    type: ReadOnlyActionTypes.SET_LOCALE,
    payload: { locale: localeStringSchema.parse(locale.toString()), pathname },
  }
}

export function setIsInBuilder(isInBuilder: boolean): SetIsInBuilderAction {
  return { type: ReadOnlyActionTypes.SET_IS_IN_BUILDER, payload: isInBuilder }
}

export function setIsReadOnly(isReadOnly: boolean): SetIsReadOnlyAction {
  return { type: ReadOnlyActionTypes.SET_IS_READ_ONLY, payload: isReadOnly }
}
