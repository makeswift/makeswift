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
  rootElements,
}: {
  rootElements?: Map<string, ReadOnlyDocuments.Element>
} = {}): State {
  return ReadOnlyDocuments.getInitialState({ rootElements })
}

function getReadOnlyDocumentsStateSlice(state: State): ReadOnlyDocuments.State {
  return state
}

export function getDocument(state: State, documentKey: string): ReadOnlyDocuments.Document | null {
  return ReadOnlyDocuments.getDocument(getReadOnlyDocumentsStateSlice(state), documentKey)
}

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    case ActionTypes.CHANGE_DOCUMENT: {
      const currentRootElement = getDocument(state, action.payload.documentKey)?.rootElement

      if (currentRootElement == null) return state

      const nextRootElement = apply(currentRootElement, action.payload.operation)

      return currentRootElement === nextRootElement
        ? state
        : new Map(state).set(
            action.payload.documentKey,
            ReadOnlyDocuments.createDocument(action.payload.documentKey, nextRootElement),
          )
    }

    default:
      return state
  }
}
