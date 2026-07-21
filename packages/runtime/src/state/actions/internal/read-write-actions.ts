import { type Operation } from 'ot-json0'
import { type ThunkAction } from '@reduxjs/toolkit'

import { ControlInstance } from '@makeswift/controls'

import { createPropController } from '../../../prop-controllers/instances'

import { type Action } from '../../actions'
import * as Builder from '../../builder-api/actions'

import { type Measurable } from '../../modules/read-write/box-models'
import {
  type ResolvedValueKey,
  type ResolvedValue,
} from '../../modules/read-write/resolved-value-overrides'
import { type DescriptorsByComponentType } from '../../modules/prop-controllers'
import { type DocumentPayload } from '../../shared-api'
import { type SerializedState as APIClientCache } from '../../api-client/state'

import { getElementPropControllerDescriptors } from '../../read-only-state'

import { type State } from '../../unified-state'

export const ReadWriteActionTypes = {
  CHANGE_ELEMENT_TREE: 'CHANGE_ELEMENT_TREE',
  REGISTER_MEASURABLE: 'REGISTER_MEASURABLE',
  UNREGISTER_MEASURABLE: 'UNREGISTER_MEASURABLE',

  SET_RESOLVED_VALUE_OVERRIDE: 'SET_RESOLVED_VALUE_OVERRIDE',
  CLEAR_RESOLVED_VALUE_OVERRIDE: 'CLEAR_RESOLVED_VALUE_OVERRIDE',

  UPDATE_API_CLIENT_CACHE: 'UPDATE_API_CLIENT_CACHE',
  CLEAR_API_CLIENT_CACHE: 'CLEAR_API_CLIENT_CACHE',
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

type SetResolvedValueOverrideAction = {
  type: typeof ReadWriteActionTypes.SET_RESOLVED_VALUE_OVERRIDE
  payload: { documentKey: string; instanceKey: ResolvedValueKey; value: ResolvedValue }
}

type ClearResolvedValueOverrideAction = {
  type: typeof ReadWriteActionTypes.CLEAR_RESOLVED_VALUE_OVERRIDE
  payload: { documentKey: string; instanceKey: ResolvedValueKey }
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
  | RegisterMeasurableAction
  | UnregisterMeasurableAction
  | SetResolvedValueOverrideAction
  | ClearResolvedValueOverrideAction
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

export function setResolvedValueOverride(
  payload: SetResolvedValueOverrideAction['payload'],
): SetResolvedValueOverrideAction {
  return {
    type: ReadWriteActionTypes.SET_RESOLVED_VALUE_OVERRIDE,
    payload,
  }
}

export function clearResolvedValueOverride(
  payload: ClearResolvedValueOverrideAction['payload'],
): ClearResolvedValueOverrideAction {
  return {
    type: ReadWriteActionTypes.CLEAR_RESOLVED_VALUE_OVERRIDE,
    payload,
  }
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

export function createPropControllers(
  documentKey: string,
  elementKey: string,
): ThunkAction<Record<string, ControlInstance> | null, State, unknown, Action> {
  return (dispatch, getState) => {
    const descriptors = getElementPropControllerDescriptors(getState(), documentKey, elementKey)

    if (descriptors == null) return null

    const propControllers = Object.entries(descriptors).reduce(
      (acc, [propName, descriptor]) => {
        const propController = createPropController({
          descriptor,
          instanceKey: { elementKey, propPath: propName },
          sendMessage: message =>
            dispatch(
              Builder.messageBuilderPropController(documentKey, elementKey, propName, message),
            ),
        }) as ControlInstance

        return { ...acc, [propName]: propController }
      },
      {} as Record<string, ControlInstance>,
    )

    return propControllers
  }
}
/*
export function createAndRegisterPropControllers(
  documentKey: string,
  elementKey: string,
): ThunkAction<Record<string, ControlInstance> | null, State, unknown, Action> {
  return dispatch => {
    const propControllers = dispatch(createPropControllers(documentKey, elementKey))

    if (propControllers != null)
      dispatch(ReadOnly.registerPropControllers(documentKey, elementKey, propControllers))

    return propControllers
  }
}
*/
