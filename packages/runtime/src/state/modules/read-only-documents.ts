import type { Action } from '../actions'

export type Data = undefined | null | boolean | number | string | Data[] | { [key: string]: Data }

export type ElementData = { type: string; key: string; props: Record<string, Data> }

export type ElementReference = { type: 'reference'; key: string; value: string }

export type Element = ElementData | ElementReference

export function isElementReference(element: Element): element is ElementReference {
  return !('props' in element)
}

export type Document = {
  rootElement: Element
}

export function createDocument(rootElement: Element): Document {
  return { rootElement }
}

export type State = Map<string, Document>

export function getInitialState({
  rootElements = new Map(),
}: { rootElements?: Map<string, Element> } = {}): State {
  const initialState = new Map()

  rootElements.forEach((rootElement, elementKey) => {
    initialState.set(elementKey, createDocument(rootElement))
  })

  return initialState
}

function getDocuments(state: State): Map<string, Document> {
  return state
}

export function getDocument(state: State, documentKey: string): Document | null {
  return getDocuments(state).get(documentKey) ?? null
}

export function getDocumentRootElement(state: State, documentKey: string): Element | null {
  return getDocument(state, documentKey)?.rootElement ?? null
}

export function reducer(state: State = getInitialState(), _action: Action): State {
  return state
}
