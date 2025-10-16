import { type ThunkAction } from '@reduxjs/toolkit'

import { type Descriptor as PropControllerDescriptor } from '../prop-controllers/descriptors'
import { type LocaleString, localeStringSchema } from '../locale'

import { type Breakpoints } from './modules/breakpoints'
import { type Element, type Document, EMBEDDED_DOCUMENT_TYPE } from './modules/read-only-documents'
import { type ComponentMeta } from './modules/components-meta'

type DocumentPayloadBaseDocument = {
  key: string
  rootElement: Element
  locale?: string | null // older versions of the runtime may not provide this field
}

type DocumentPayloadEmbeddedDocument = {
  key: string
  locale: string | null
  id: string
  type: string
  name: string
  rootElement: Element
  meta: { allowLocaleFallback: boolean; requestedLocale: string | null; description?: string }
  __type: typeof EMBEDDED_DOCUMENT_TYPE
}

export type DocumentPayload = DocumentPayloadBaseDocument | DocumentPayloadEmbeddedDocument

export const SharedActionTypes = {
  MAKESWIFT_CONNECTION_INIT: 'MAKESWIFT_CONNECTION_INIT',

  REGISTER_DOCUMENT: 'REGISTER_DOCUMENT',
  UNREGISTER_DOCUMENT: 'UNREGISTER_DOCUMENT',

  REGISTER_COMPONENT: 'REGISTER_COMPONENT',
  UNREGISTER_COMPONENT: 'UNREGISTER_COMPONENT',

  SET_BREAKPOINTS: 'SET_BREAKPOINTS',
  SET_LOCALE: 'SET_LOCALE',
  SET_LOCALIZED_RESOURCE_ID: 'SET_LOCALIZED_RESOURCE_ID',
} as const

type MakeswiftConnectionInitAction = { type: typeof SharedActionTypes.MAKESWIFT_CONNECTION_INIT }

type RegisterDocumentAction = {
  type: typeof SharedActionTypes.REGISTER_DOCUMENT
  payload: { documentKey: string; document: DocumentPayload }
}

type UnregisterDocumentAction = {
  type: typeof SharedActionTypes.UNREGISTER_DOCUMENT
  payload: { documentKey: string }
}

type RegisterComponentAction = {
  type: typeof SharedActionTypes.REGISTER_COMPONENT
  payload: {
    type: string
    meta: ComponentMeta
    propControllerDescriptors: Record<string, PropControllerDescriptor>
  }
}

type UnregisterComponentAction = {
  type: typeof SharedActionTypes.UNREGISTER_COMPONENT
  payload: { type: string }
}

export type SetBreakpointsAction = {
  type: typeof SharedActionTypes.SET_BREAKPOINTS
  payload: { breakpoints: Breakpoints }
}

type SetLocaleAction = {
  type: typeof SharedActionTypes.SET_LOCALE
  payload: { locale: LocaleString; pathname?: string }
}

type SetLocalizedResourceIdAction = {
  type: typeof SharedActionTypes.SET_LOCALIZED_RESOURCE_ID
  // TODO: make `locale` required once we've upgraded the builder to always provide it
  payload: { locale?: string; resourceId: string; localizedResourceId: string | null }
}

export type SharedAction =
  | MakeswiftConnectionInitAction
  | RegisterDocumentAction
  | UnregisterDocumentAction
  | RegisterComponentAction
  | UnregisterComponentAction
  | SetBreakpointsAction
  | SetLocaleAction
  | SetLocalizedResourceIdAction

export function makeswiftConnectionInit(): MakeswiftConnectionInitAction {
  return {
    type: SharedActionTypes.MAKESWIFT_CONNECTION_INIT,
  }
}

export function registerDocument(document: Document): RegisterDocumentAction {
  return {
    type: SharedActionTypes.REGISTER_DOCUMENT,
    payload: { documentKey: document.key, document },
  }
}

export function unregisterDocument(documentKey: string): UnregisterDocumentAction {
  return { type: SharedActionTypes.UNREGISTER_DOCUMENT, payload: { documentKey } }
}

export function registerDocumentsEffect(
  documents: Document[],
): ThunkAction<() => void, unknown, unknown, SharedAction> {
  return dispatch => {
    documents.forEach(document => dispatch(registerDocument(document)))

    return () => {
      documents.forEach(document => dispatch(unregisterDocument(document.key)))
    }
  }
}

export function registerComponent(
  type: string,
  meta: ComponentMeta,
  propControllerDescriptors: Record<string, PropControllerDescriptor>,
): RegisterComponentAction {
  return {
    type: SharedActionTypes.REGISTER_COMPONENT,
    payload: { type, meta, propControllerDescriptors },
  }
}

export function unregisterComponent(type: string): UnregisterComponentAction {
  return { type: SharedActionTypes.UNREGISTER_COMPONENT, payload: { type } }
}

export function registerComponentEffect(
  type: string,
  meta: ComponentMeta,
  propControllerDescriptors: Record<string, PropControllerDescriptor>,
): ThunkAction<() => void, unknown, unknown, SharedAction> {
  return dispatch => {
    dispatch(registerComponent(type, meta, propControllerDescriptors))

    return () => {
      dispatch(unregisterComponent(type))
    }
  }
}

export function setBreakpoints(breakpoints: Breakpoints): SetBreakpointsAction {
  return { type: SharedActionTypes.SET_BREAKPOINTS, payload: { breakpoints } }
}

export function setLocale(locale: Intl.Locale, pathname?: string): SetLocaleAction {
  return {
    type: SharedActionTypes.SET_LOCALE,
    payload: { locale: localeStringSchema.parse(locale.toString()), pathname },
  }
}

export function setLocalizedResourceId({
  resourceId,
  localizedResourceId,
  locale,
}: {
  resourceId: string
  localizedResourceId: string | null
  locale?: string
}): SetLocalizedResourceIdAction {
  return {
    type: SharedActionTypes.SET_LOCALIZED_RESOURCE_ID,
    payload: { resourceId, localizedResourceId, locale },
  }
}
