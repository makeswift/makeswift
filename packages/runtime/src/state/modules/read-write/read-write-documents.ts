import { type Operation } from 'ot-json0'
import { removeIn, setIn } from 'immutable'

import * as ReadOnlyDocuments from '../read-only-documents'
import { type Action, type UnknownAction, ActionTypes, isKnownAction } from '../../actions'

export type { Document, Element, ElementData, ElementReference } from '../read-only-documents'
export { isElementReference } from '../read-only-documents'
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
  documents = [],
}: { documents?: ReadOnlyDocuments.Document[] } = {}): State {
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

export function reducer(state: State = getInitialState(), action: Action | UnknownAction): State {
  const nextState = ReadOnlyDocuments.reducer(state, action)

  if (!isKnownAction(action)) return state

  switch (action.type) {
    case ActionTypes.CHANGE_DOCUMENT: {
      const document = getDocument(nextState, action.payload.documentKey)
      if (document == null) return nextState

      const currentRootElement = ReadOnlyDocuments.getRootElement(document)

      const nextRootElement = apply(currentRootElement, action.payload.operation)

      return currentRootElement === nextRootElement
        ? nextState
        : new Map(nextState).set(action.payload.documentKey, {
            ...document,
            rootElement: nextRootElement,
          })
    }

    default:
      return nextState
  }
}
