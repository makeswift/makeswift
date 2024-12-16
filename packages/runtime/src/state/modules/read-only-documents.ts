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

export type Document = {
  key: string
  rootElement: Element
}

export function createDocument(key: string, rootElement: Element): Document {
  return { key, rootElement }
}

export type State = Map<string, Document>

export function getInitialState({
  rootElements = new Map(),
}: { rootElements?: Map<string, Element> } = {}): State {
  const initialState = new Map()

  rootElements.forEach((rootElement, documentKey) => {
    initialState.set(documentKey, createDocument(documentKey, rootElement))
  })

  return initialState
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
