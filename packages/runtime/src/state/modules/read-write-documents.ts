import { Operation } from 'ot-json0'
import { removeIn, setIn } from 'immutable'

import * as ReadOnlyDocuments from './read-only-documents'
import { Action, ActionTypes } from '../actions'

export type { Document, Element, ElementData, ElementReference } from './read-only-documents'
export { isElementReference } from './read-only-documents'
export type { Operation }

function apply(data: ReadOnlyDocuments.Element, operation: Operation): ReadOnlyDocuments.Element {
  let applied = data

  operation.forEach(component => {
    // @ts-expect-error: `ld` isn't in all possible values of `component`
    if (component.ld != null) applied = removeIn(applied, component.p)

    // @ts-expect-error: `od` isn't in all possible values of `component`
    if (component.od != null) applied = removeIn(applied, component.p)

    // @ts-expect-error: `li` isn't in all possible values of `component`
    if (component.li != null) applied = setIn(applied, component.p, component.li)

    // @ts-expect-error: `oi` isn't in all possible values of `component`
    if (component.oi != null) applied = setIn(applied, component.p, component.oi)
  })

  return applied
}

export type State = ReadOnlyDocuments.State

export function getInitialState({
  documents,
}: {
  documents?: ReadOnlyDocuments.Document[]
} = {}): State {
  return ReadOnlyDocuments.getInitialState({ documents })
}

function getReadOnlyDocumentsStateSlice(state: State): ReadOnlyDocuments.State {
  return state
}

export function getDocument(state: State, documentKey: string): ReadOnlyDocuments.Document | null {
  return ReadOnlyDocuments.getDocument(getReadOnlyDocumentsStateSlice(state), documentKey)
}

export function getDocuments(state: State): ReadOnlyDocuments.State {
  return ReadOnlyDocuments.getDocuments(getReadOnlyDocumentsStateSlice(state))
}

export function reducer(state: State = getInitialState(), action: Action): State {
  const nextState = ReadOnlyDocuments.reducer(state, action)

  switch (action.type) {
    case ActionTypes.CHANGE_DOCUMENT: {
      const document = getDocument(nextState, action.payload.documentKey)

      if (document == null) return nextState

      const currentRootElement = document.rootElement
      const nextRootElement = apply(currentRootElement, action.payload.operation)

      return currentRootElement === nextRootElement
        ? nextState
        : new Map(nextState).set(
            action.payload.documentKey,
            ReadOnlyDocuments.createDocument({ ...document, rootElement: nextRootElement }),
          )
    }

    default:
      return nextState
  }
}

export function encodeDocumentIdV1({
  id,
  type,
  key,
  branch,
}: {
  id: string
  type: string
  key: string
  branch?: string
}): string {
  return `v1:${id}:${type}:${key}:${branch}`
}

export function decodeDocumentId(documentId: string): {
  id: string
  type: string
  key: string
  branch: string
} {
  const [_version, id, type, key, branch] = documentId.split(':')

  return { id, type, key, branch }
}
