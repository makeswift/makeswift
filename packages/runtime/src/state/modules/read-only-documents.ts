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

export const DESERIALIZED_PAGES_COLLECTION = 'deserialized_pages' as const
export const ELEMENT_TREE_COLLECTION = 'element_tree' as const

type DeserializedPagesCollection = typeof DESERIALIZED_PAGES_COLLECTION
type ElementTreeCollection = typeof ELEMENT_TREE_COLLECTION

type DocumentCollection = DeserializedPagesCollection | ElementTreeCollection

export type Document = {
  key: string
  rootElement: Element
  type?: string
  collection?: DocumentCollection
}

export function createDocument(document: Document): Document {
  return document
}

export type State = Map<string, Document>

export function getInitialState({ documents = [] }: { documents?: Document[] } = {}): State {
  const initialState = new Map()

  documents.forEach(document => {
    initialState.set(document.key, createDocument(document))
  })

  return initialState
}

export function getDocuments(state: State): Map<string, Document> {
  return state
}

export function getDocument(state: State, documentKey: string): Document | null {
  return getDocuments(state).get(documentKey) ?? null
}

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    case ActionTypes.REGISTER_DOCUMENT:
      return new Map(state).set(action.payload.documentKey, action.payload.document)

    case ActionTypes.UNREGISTER_DOCUMENT: {
      const nextState = new Map(state)

      const deleted = nextState.delete(action.payload.documentKey)

      return deleted ? nextState : state
    }

    default:
      return state
  }
}
