import { type Operation } from 'ot-json0'
import { type ThunkAction } from '@reduxjs/toolkit'

import { type Measurable } from '../../modules/read-write/box-models'
import { type DescriptorsByComponentType } from '../../modules/prop-controllers'

import { type DocumentPayload } from '../../shared-api'
import { type SerializedState as APIClientCache } from '../../makeswift-api-client'

export const ReadWriteActionTypes = {
  CHANGE_ELEMENT_TREE: 'CHANGE_ELEMENT_TREE',
  REGISTER_MEASURABLE: 'REGISTER_MEASURABLE',
  UNREGISTER_MEASURABLE: 'UNREGISTER_MEASURABLE',

  UPDATE_API_CLIENT_CACHE: 'UPDATE_API_CLIENT_CACHE',
} as const

type ChangeElementTreeAction = {
  type: typeof ReadWriteActionTypes.CHANGE_ELEMENT_TREE
  payload: {
    oldDocument: DocumentPayload
    newDocument: DocumentPayload
    descriptors: DescriptorsByComponentType
    operation: Operation
  }
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

export type ReadWriteAction =
  | ChangeElementTreeAction
  | RegisterMeasurableAction
  | UnregisterMeasurableAction
  | UpdateAPIClientCache

export function changeElementTree(
  payload: ChangeElementTreeAction['payload'],
): ChangeElementTreeAction {
  return {
    type: ReadWriteActionTypes.CHANGE_ELEMENT_TREE,
    payload,
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
