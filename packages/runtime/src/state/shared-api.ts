import { type ThunkAction } from '@reduxjs/toolkit'

import { type Element, type Document, EMBEDDED_DOCUMENT_TYPE } from './modules/read-only-documents'

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

// bidirectional action types, both the host and the builder can dispatch these actions
export const SharedActionTypes = {
  MAKESWIFT_CONNECTION_INIT: 'MAKESWIFT_CONNECTION_INIT',

  REGISTER_DOCUMENT: 'REGISTER_DOCUMENT',
  UNREGISTER_DOCUMENT: 'UNREGISTER_DOCUMENT',
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

export type SharedAction =
  | MakeswiftConnectionInitAction
  | RegisterDocumentAction
  | UnregisterDocumentAction

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
