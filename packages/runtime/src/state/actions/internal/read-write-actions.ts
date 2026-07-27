import { type Operation } from 'ot-json0'
import { type ThunkAction } from '@reduxjs/toolkit'

import { ControlInstance } from '@makeswift/controls'

import { ElementImperativeHandle } from '../../../runtimes/react/element-imperative-handle'

import { type DescriptorsByComponentType } from '../../modules/prop-controller-descriptors'
import { type Measurable } from '../../modules/read-write/box-models'
import { type PropControllersHandle } from '../../modules/read-write/prop-controllers'

import { type DocumentPayload } from '../../shared-api'
import { type SerializedState as APIClientCache } from '../../api-client/state'

import { ReadWriteActionTypes } from './read-write-action-types'

type ChangeElementTreeAction = {
  type: typeof ReadWriteActionTypes.CHANGE_ELEMENT_TREE
  payload: {
    oldDocument: DocumentPayload
    newDocument: DocumentPayload
    descriptors: DescriptorsByComponentType
    operation: Operation
  }
}

type RegisterComponentHandleAction = {
  type: typeof ReadWriteActionTypes.REGISTER_COMPONENT_HANDLE
  payload: { documentKey: string; elementKey: string; componentHandle: ElementImperativeHandle }
}

type UnregisterComponentHandleAction = {
  type: typeof ReadWriteActionTypes.UNREGISTER_COMPONENT_HANDLE
  payload: { documentKey: string; elementKey: string }
}

type RegisterPropControllersHandleAction = {
  type: typeof ReadWriteActionTypes.REGISTER_PROP_CONTROLLERS_HANDLE
  payload: { documentKey: string; elementKey: string; handle: PropControllersHandle }
}

type UnregisterPropControllersHandleAction = {
  type: typeof ReadWriteActionTypes.UNREGISTER_PROP_CONTROLLERS_HANDLE
  payload: { documentKey: string; elementKey: string }
}

type RegisterPropControllersAction = {
  type: typeof ReadWriteActionTypes.REGISTER_PROP_CONTROLLERS
  payload: {
    documentKey: string
    elementKey: string
    propControllers: Record<string, ControlInstance>
  }
}

type UnregisterPropControllersAction = {
  type: typeof ReadWriteActionTypes.UNREGISTER_PROP_CONTROLLERS
  payload: { documentKey: string; elementKey: string }
}

type RegisterMeasurableAction = {
  type: typeof ReadWriteActionTypes.REGISTER_MEASURABLE
  payload: { documentKey: string; elementKey: string; measurable: Measurable }
}

type UnregisterMeasurableAction = {
  type: typeof ReadWriteActionTypes.UNREGISTER_MEASURABLE
  payload: { documentKey: string; elementKey: string }
}

type UpdateAPIClientCache = {
  type: typeof ReadWriteActionTypes.UPDATE_API_CLIENT_CACHE
  payload: APIClientCache
}

type ClearAPIClientCache = {
  type: typeof ReadWriteActionTypes.CLEAR_API_CLIENT_CACHE
}

export type ReadWriteAction =
  | ChangeElementTreeAction
  | RegisterComponentHandleAction
  | UnregisterComponentHandleAction
  | RegisterPropControllersHandleAction
  | UnregisterPropControllersHandleAction
  | RegisterPropControllersAction
  | UnregisterPropControllersAction
  | RegisterMeasurableAction
  | UnregisterMeasurableAction
  | UpdateAPIClientCache
  | ClearAPIClientCache

export function changeElementTree(
  payload: ChangeElementTreeAction['payload'],
): ChangeElementTreeAction {
  return {
    type: ReadWriteActionTypes.CHANGE_ELEMENT_TREE,
    payload,
  }
}

export function registerComponentHandle(
  documentKey: string,
  elementKey: string,
  componentHandle: ElementImperativeHandle,
): RegisterComponentHandleAction {
  return {
    type: ReadWriteActionTypes.REGISTER_COMPONENT_HANDLE,
    payload: { documentKey, elementKey, componentHandle },
  }
}

function unregisterComponentHandle(
  documentKey: string,
  elementKey: string,
): UnregisterComponentHandleAction {
  return {
    type: ReadWriteActionTypes.UNREGISTER_COMPONENT_HANDLE,
    payload: { documentKey, elementKey },
  }
}

export function registerComponentHandleEffect(
  documentKey: string,
  elementKey: string,
  componentHandle: ElementImperativeHandle,
): ThunkAction<() => void, unknown, unknown, ReadWriteAction> {
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
    type: ReadWriteActionTypes.REGISTER_PROP_CONTROLLERS_HANDLE,
    payload: { documentKey, elementKey, handle },
  }
}

export function unregisterPropControllersHandle(
  documentKey: string,
  elementKey: string,
): UnregisterPropControllersHandleAction {
  return {
    type: ReadWriteActionTypes.UNREGISTER_PROP_CONTROLLERS_HANDLE,
    payload: { documentKey, elementKey },
  }
}

export function registerPropControllers(
  documentKey: string,
  elementKey: string,
  propControllers: Record<string, ControlInstance>,
): RegisterPropControllersAction {
  return {
    type: ReadWriteActionTypes.REGISTER_PROP_CONTROLLERS,
    payload: { documentKey, elementKey, propControllers },
  }
}

export function unregisterPropControllers(
  documentKey: string,
  elementKey: string,
): UnregisterPropControllersAction {
  return {
    type: ReadWriteActionTypes.UNREGISTER_PROP_CONTROLLERS,
    payload: { documentKey, elementKey },
  }
}

export function registerMeasurable(
  documentKey: string,
  elementKey: string,
  measurable: Measurable,
): RegisterMeasurableAction {
  return {
    type: ReadWriteActionTypes.REGISTER_MEASURABLE,
    payload: { documentKey, elementKey, measurable },
  }
}

export function unregisterMeasurable(
  documentKey: string,
  elementKey: string,
): UnregisterMeasurableAction {
  return { type: ReadWriteActionTypes.UNREGISTER_MEASURABLE, payload: { documentKey, elementKey } }
}

export function registerMeasurableEffect(
  documentKey: string,
  elementKey: string,
  measurable: Measurable,
): ThunkAction<() => void, unknown, unknown, ReadWriteAction> {
  return dispatch => {
    dispatch(registerMeasurable(documentKey, elementKey, measurable))

    return () => {
      dispatch(unregisterMeasurable(documentKey, elementKey))
    }
  }
}

export function updateAPIClientCache(payload: APIClientCache): UpdateAPIClientCache {
  return { type: ReadWriteActionTypes.UPDATE_API_CLIENT_CACHE, payload }
}

export function clearAPIClientCache(): ClearAPIClientCache {
  return { type: ReadWriteActionTypes.CLEAR_API_CLIENT_CACHE }
}
