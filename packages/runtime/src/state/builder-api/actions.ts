import { type ThunkAction } from '@reduxjs/toolkit'

import { type SerializedControl } from '../../builder'
import { type PropControllerMessage } from '../../prop-controllers/instances'

import { type Document } from '../modules/read-only-documents'
import { type BoxModel } from '../modules/box-models'
import { type ComponentMeta } from '../modules/components-meta'

import { type Size } from '../react-builder-preview'
import { type DocumentPayload, type SharedAction, SharedActionTypes } from '../shared-api'

export const BuilderActionTypes = {
  ...SharedActionTypes,

  MAKESWIFT_CONNECTION_CHECK: 'MAKESWIFT_CONNECTION_CHECK',

  CHANGE_ELEMENT_BOX_MODELS: 'CHANGE_ELEMENT_BOX_MODELS',

  MOUNT_COMPONENT: 'MOUNT_COMPONENT',
  UNMOUNT_COMPONENT: 'UNMOUNT_COMPONENT',

  CHANGE_DOCUMENT_ELEMENT_SIZE: 'CHANGE_DOCUMENT_ELEMENT_SIZE',
  MESSAGE_BUILDER_PROP_CONTROLLER: 'MESSAGE_BUILDER_PROP_CONTROLLER',

  HANDLE_WHEEL: 'HANDLE_WHEEL',
  HANDLE_POINTER_MOVE: 'HANDLE_POINTER_MOVE',

  ELEMENT_FROM_POINT_CHANGE: 'ELEMENT_FROM_POINT_CHANGE',

  REGISTER_BUILDER_DOCUMENT: 'REGISTER_BUILDER_DOCUMENT',
  UNREGISTER_BUILDER_DOCUMENT: 'UNREGISTER_BUILDER_DOCUMENT',

  REGISTER_BUILDER_COMPONENT: 'REGISTER_BUILDER_COMPONENT',
  UNREGISTER_BUILDER_COMPONENT: 'UNREGISTER_BUILDER_COMPONENT',

  HANDLE_HOST_NAVIGATE: 'HANDLE_HOST_NAVIGATE',
} as const

type ActionWithTransferables<A> = A & {
  transferables?: Transferable[]
}

type MakeswiftConnectionCheckAction = {
  type: typeof BuilderActionTypes.MAKESWIFT_CONNECTION_CHECK
  payload: { currentUrl: string }
}

type ChangeElementBoxModelsAction = {
  type: typeof BuilderActionTypes.CHANGE_ELEMENT_BOX_MODELS
  payload: { changedElementBoxModels: Map<string, Map<string, BoxModel | null>> }
}

type MountComponentAction = {
  type: typeof BuilderActionTypes.MOUNT_COMPONENT
  payload: { documentKey: string; elementKey: string }
}

type UnmountComponentAction = {
  type: typeof BuilderActionTypes.UNMOUNT_COMPONENT
  payload: { documentKey: string; elementKey: string }
}

type ChangeDocumentElementSizeAction = {
  type: typeof BuilderActionTypes.CHANGE_DOCUMENT_ELEMENT_SIZE
  payload: { size: Size }
}

type MessageBuilderPropControllerAction<T = PropControllerMessage> = {
  type: typeof BuilderActionTypes.MESSAGE_BUILDER_PROP_CONTROLLER
  payload: { documentKey: string; elementKey: string; propName: string; message: T }
}

type HandleWheelAction = {
  type: typeof BuilderActionTypes.HANDLE_WHEEL
  payload: { deltaX: number; deltaY: number }
}

type HandlePointerMoveAction = {
  type: typeof BuilderActionTypes.HANDLE_POINTER_MOVE
  payload: { clientX: number; clientY: number }
}

type ElementFromPointChangeAction = {
  type: typeof BuilderActionTypes.ELEMENT_FROM_POINT_CHANGE
  payload: { keys: { documentKey: string; elementKey: string } | null }
}

type RegisterBuilderDocumentAction = {
  type: typeof BuilderActionTypes.REGISTER_BUILDER_DOCUMENT
  payload: { documentKey: string; document: DocumentPayload }
}

type UnregisterBuilderDocumentAction = {
  type: typeof BuilderActionTypes.UNREGISTER_BUILDER_DOCUMENT
  payload: { documentKey: string }
}

type RegisterBuilderComponentAction = {
  type: typeof BuilderActionTypes.REGISTER_BUILDER_COMPONENT
  payload: {
    type: string
    meta: ComponentMeta
    serializedControls: Record<string, SerializedControl>
  }
}

type UnregisterBuilderComponentAction = {
  type: typeof BuilderActionTypes.UNREGISTER_BUILDER_COMPONENT
  payload: { type: string }
}

type HandleHostNavigateAction = {
  type: typeof BuilderActionTypes.HANDLE_HOST_NAVIGATE
  payload: { url: string | null }
}

export type BuilderAction =
  | SharedAction
  | MakeswiftConnectionCheckAction
  | ChangeElementBoxModelsAction
  | MountComponentAction
  | UnmountComponentAction
  | ChangeDocumentElementSizeAction
  | MessageBuilderPropControllerAction
  | HandleWheelAction
  | HandlePointerMoveAction
  | ElementFromPointChangeAction
  | RegisterBuilderDocumentAction
  | UnregisterBuilderDocumentAction
  | RegisterBuilderComponentAction
  | UnregisterBuilderComponentAction
  | HandleHostNavigateAction

export function makeswiftConnectionCheck(
  payload: MakeswiftConnectionCheckAction['payload'],
): MakeswiftConnectionCheckAction {
  return { type: BuilderActionTypes.MAKESWIFT_CONNECTION_CHECK, payload }
}

export function changeElementBoxModels(
  changedElementBoxModels: Map<string, Map<string, BoxModel | null>>,
): ChangeElementBoxModelsAction {
  return {
    type: BuilderActionTypes.CHANGE_ELEMENT_BOX_MODELS,
    payload: { changedElementBoxModels },
  }
}

export function mountComponent(documentKey: string, elementKey: string): MountComponentAction {
  return { type: BuilderActionTypes.MOUNT_COMPONENT, payload: { documentKey, elementKey } }
}

export function unmountComponent(documentKey: string, elementKey: string): UnmountComponentAction {
  return { type: BuilderActionTypes.UNMOUNT_COMPONENT, payload: { documentKey, elementKey } }
}

export function mountComponentEffect(
  documentKey: string,
  elementKey: string,
): ThunkAction<() => void, unknown, unknown, BuilderAction> {
  return dispatch => {
    dispatch(mountComponent(documentKey, elementKey))

    return () => {
      dispatch(unmountComponent(documentKey, elementKey))
    }
  }
}

export function changeDocumentElementSize(size: Size): ChangeDocumentElementSizeAction {
  return { type: BuilderActionTypes.CHANGE_DOCUMENT_ELEMENT_SIZE, payload: { size } }
}

export function messageBuilderPropController<T>(
  documentKey: string,
  elementKey: string,
  propName: string,
  message: T,
): MessageBuilderPropControllerAction<T> {
  return {
    type: BuilderActionTypes.MESSAGE_BUILDER_PROP_CONTROLLER,
    payload: { documentKey, elementKey, propName, message },
  }
}

export function handleWheel(payload: { deltaX: number; deltaY: number }): HandleWheelAction {
  return { type: BuilderActionTypes.HANDLE_WHEEL, payload }
}

export function handlePointerMove(payload: {
  clientX: number
  clientY: number
}): HandlePointerMoveAction {
  return { type: BuilderActionTypes.HANDLE_POINTER_MOVE, payload }
}

export function elementFromPointChange(
  keys: {
    documentKey: string
    elementKey: string
  } | null,
): ElementFromPointChangeAction {
  return { type: BuilderActionTypes.ELEMENT_FROM_POINT_CHANGE, payload: { keys } }
}

export function registerBuilderDocument(document: Document): RegisterBuilderDocumentAction {
  return {
    type: BuilderActionTypes.REGISTER_BUILDER_DOCUMENT,
    payload: { documentKey: document.key, document },
  }
}

export function unregisterBuilderDocument(documentKey: string): UnregisterBuilderDocumentAction {
  return { type: BuilderActionTypes.UNREGISTER_BUILDER_DOCUMENT, payload: { documentKey } }
}

export function registerBuilderDocumentsEffect(
  documents: Document[],
): ThunkAction<() => void, unknown, unknown, BuilderAction> {
  return dispatch => {
    documents.forEach(document => dispatch(registerBuilderDocument(document)))

    return () => {
      documents.forEach(document => dispatch(unregisterBuilderDocument(document.key)))
    }
  }
}

export function registerBuilderComponent(
  payload: RegisterBuilderComponentAction['payload'],
  transferables?: Transferable[],
): ActionWithTransferables<RegisterBuilderComponentAction> {
  return {
    type: BuilderActionTypes.REGISTER_BUILDER_COMPONENT,
    payload,
    transferables,
  }
}

export function unregisterBuilderComponent(
  payload: UnregisterBuilderComponentAction['payload'],
): UnregisterBuilderComponentAction {
  return { type: BuilderActionTypes.UNREGISTER_BUILDER_COMPONENT, payload }
}

export function hasTransferables<A extends BuilderAction>(
  action: A,
): action is ActionWithTransferables<A> {
  return 'transferables' in action && Array.isArray(action.transferables)
}
