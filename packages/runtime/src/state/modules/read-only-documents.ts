import { type Element } from '@makeswift/controls'
import { Action, ActionTypes } from '../actions'

export {
  type Data,
  type ElementData,
  type ElementReference,
  type Element,
  isElementReference,
} from '@makeswift/controls'

export type DocumentReference = {
  key: string
}

export function createDocumentReference(key: string): DocumentReference {
  return { key }
}

type BaseDocument = {
  key: string
  rootElement: Element
  locale: string | null
}

export const EMBEDDED_DOCUMENT_TYPE = 'EMBEDDED_DOCUMENT' as const

export type EmbeddedDocument = BaseDocument & {
  id: string
  type: string
  name: string
  __type: typeof EMBEDDED_DOCUMENT_TYPE
}

export type Document = BaseDocument | EmbeddedDocument

export function createBaseDocument(
  key: string,
  rootElement: Element,
  locale: string | null,
): Document {
  return { key, rootElement, locale }
}

export type State = Map<string, Document>

export function getInitialState({ documents = [] }: { documents?: Document[] } = {}): State {
  return new Map(documents.map(document => [document.key, document]))
}

export function getDocuments(state: State): State {
  return state
}

export function getDocument(state: State, documentKey: string): Document | null {
  return getDocuments(state).get(documentKey) ?? null
}

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    case ActionTypes.REGISTER_DOCUMENT:
      const { documentKey, document } = action.payload
      return new Map(state).set(documentKey, { ...document, locale: document.locale ?? null })

    case ActionTypes.UNREGISTER_DOCUMENT: {
      const nextState = new Map(state)

      const deleted = nextState.delete(action.payload.documentKey)

      return deleted ? nextState : state
    }

    default:
      return state
  }
}
