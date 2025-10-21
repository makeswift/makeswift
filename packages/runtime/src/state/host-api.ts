import { type Operation } from 'ot-json0'

import { type PropControllerMessage } from '../prop-controllers/instances'
import { type APIResource, APIResourceLocale } from '../api/types'

import { BuilderEditMode } from './modules/builder-edit-mode'
import { type Point } from './modules/pointer'

export const HostActionTypes = {
  INIT: 'INIT',
  CLEAN_UP: 'CLEAN_UP',

  CHANGE_DOCUMENT: 'CHANGE_DOCUMENT',

  CHANGE_DOCUMENT_ELEMENT_SCROLL_TOP: 'CHANGE_DOCUMENT_ELEMENT_SCROLL_TOP',
  SCROLL_DOCUMENT_ELEMENT: 'SCROLL_DOCUMENT_ELEMENT',

  MESSAGE_HOST_PROP_CONTROLLER: 'MESSAGE_HOST_PROP_CONTROLLER',

  CHANGE_API_RESOURCE: 'CHANGE_API_RESOURCE',
  EVICT_API_RESOURCE: 'EVICT_API_RESOURCE',

  SET_BUILDER_EDIT_MODE: 'SET_BUILDER_EDIT_MODE',

  BUILDER_POINTER_MOVE: 'BUILDER_POINTER_MOVE',
} as const

type InitAction = { type: typeof HostActionTypes.INIT }

type CleanUpAction = { type: typeof HostActionTypes.CLEAN_UP }

type ChangeDocumentAction = {
  type: typeof HostActionTypes.CHANGE_DOCUMENT
  payload: { documentKey: string; operation: Operation }
}

type ChangeDocumentElementScrollTopAction = {
  type: typeof HostActionTypes.CHANGE_DOCUMENT_ELEMENT_SCROLL_TOP
  payload: { scrollTop: number }
}

type ScrollDocumentElementAction = {
  type: typeof HostActionTypes.SCROLL_DOCUMENT_ELEMENT
  payload: { scrollTopDelta: number }
}

type MessageHostPropControllerAction<T = PropControllerMessage> = {
  type: typeof HostActionTypes.MESSAGE_HOST_PROP_CONTROLLER
  payload: { documentKey: string; elementKey: string; propName: string; message: T }
}

type ChangeAPIResourceAction = {
  type: typeof HostActionTypes.CHANGE_API_RESOURCE
  payload: { resource: APIResource; locale?: string | null }
}

type EvictAPIResourceAction = {
  type: typeof HostActionTypes.EVICT_API_RESOURCE
  payload: { id: string; locale?: string | null }
}

type SetBuilderEditModeAction = {
  type: typeof HostActionTypes.SET_BUILDER_EDIT_MODE
  payload: { editMode: BuilderEditMode }
}

type BuilderPointerMoveAction = {
  type: typeof HostActionTypes.BUILDER_POINTER_MOVE
  payload: { pointer: Point | null }
}

export type HostAction =
  | InitAction
  | CleanUpAction
  | ChangeDocumentAction
  | ChangeDocumentElementScrollTopAction
  | ScrollDocumentElementAction
  | MessageHostPropControllerAction
  | ChangeAPIResourceAction
  | EvictAPIResourceAction
  | SetBuilderEditModeAction
  | BuilderPointerMoveAction

export function init(): InitAction {
  return { type: HostActionTypes.INIT }
}

export function cleanUp(): CleanUpAction {
  return { type: HostActionTypes.CLEAN_UP }
}

export function changeDocument(documentKey: string, operation: Operation): ChangeDocumentAction {
  return { type: HostActionTypes.CHANGE_DOCUMENT, payload: { documentKey, operation } }
}

export function changeDocumentElementScrollTop(
  scrollTop: number,
): ChangeDocumentElementScrollTopAction {
  return { type: HostActionTypes.CHANGE_DOCUMENT_ELEMENT_SCROLL_TOP, payload: { scrollTop } }
}

export function scrollDocumentElement(scrollTopDelta: number): ScrollDocumentElementAction {
  return { type: HostActionTypes.SCROLL_DOCUMENT_ELEMENT, payload: { scrollTopDelta } }
}

export function messageHostPropController<T>(
  documentKey: string,
  elementKey: string,
  propName: string,
  message: T,
): MessageHostPropControllerAction<T> {
  return {
    type: HostActionTypes.MESSAGE_HOST_PROP_CONTROLLER,
    payload: { documentKey, elementKey, propName, message },
  }
}

export function changeApiResource<R extends APIResource>(
  resource: R,
  locale?: APIResourceLocale<R>,
): ChangeAPIResourceAction {
  return { type: HostActionTypes.CHANGE_API_RESOURCE, payload: { resource, locale } }
}

export function evictApiResource(id: string, locale?: string | null): EvictAPIResourceAction {
  return { type: HostActionTypes.EVICT_API_RESOURCE, payload: { id, locale } }
}

export function setBuilderEditMode(editMode: BuilderEditMode): SetBuilderEditModeAction {
  return {
    type: HostActionTypes.SET_BUILDER_EDIT_MODE,
    payload: { editMode },
  }
}

export function builderPointerMove(pointer: Point | null): BuilderPointerMoveAction {
  return { type: HostActionTypes.BUILDER_POINTER_MOVE, payload: { pointer } }
}
