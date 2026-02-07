import { combineReducers, type ThunkAction, type ThunkDispatch } from '@reduxjs/toolkit'

import * as Documents from './modules/read-write/read-write-documents'
import * as BoxModels from './modules/read-write/box-models'
import * as Pointer from './modules/read-write/pointer'
import * as ElementImperativeHandles from './modules/read-write/element-imperative-handles'

import { type Action } from './actions'

import { ElementImperativeHandle } from '../runtimes/react/element-imperative-handle'

import { BuilderAPIProxy } from './builder-api/proxy'
import * as ReadOnlyState from './read-only-state'

export type { Operation } from './modules/read-write/read-write-documents'
export type { BoxModelHandle } from './modules/read-write/box-models'
export { createBox, getBox, parse } from './modules/read-write/box-models'

const reducers = {
  ...ReadOnlyState.reducers,
  documents: Documents.reducer,
  boxModels: BoxModels.reducer,
  pointer: Pointer.reducer,
  elementImperativeHandles: ElementImperativeHandles.reducer,
}

export function createRootReducer() {
  return combineReducers(reducers)
}

export type State = Omit<ReadOnlyState.State, 'documents'> & {
  documents: Documents.State
  boxModels: BoxModels.State
  pointer: Pointer.State
  elementImperativeHandles: ElementImperativeHandles.State
}

export type Dispatch = ThunkDispatch<State, unknown, Action>

function getDocumentsStateSlice(state: State): Documents.State {
  return state.documents
}

export function getDocuments(state: State): Documents.State {
  return Documents.getDocuments(getDocumentsStateSlice(state))
}

export function getDocument(state: State, documentKey: string): Documents.Document | null {
  return Documents.getDocument(getDocumentsStateSlice(state), documentKey)
}

function getBoxModelsStateSlice(state: State): BoxModels.State {
  return state.boxModels
}

export function getMeasurables(state: State): Map<string, Map<string, BoxModels.Measurable>> {
  return BoxModels.getMeasurables(getBoxModelsStateSlice(state))
}

export function getBoxModels(state: State): Map<string, Map<string, BoxModels.BoxModel>> {
  return BoxModels.getBoxModels(getBoxModelsStateSlice(state))
}

export function getBoxModel(
  state: State,
  documentKey: string,
  elementKey: string,
): BoxModels.BoxModel | null {
  return BoxModels.getBoxModel(getBoxModelsStateSlice(state), documentKey, elementKey)
}

export function getPointer(state: State): Pointer.Point | null {
  return Pointer.getPointer(state.pointer)
}

export function getElementImperativeHandles(
  state: State,
): Map<string, Map<string, ElementImperativeHandle>> {
  return ElementImperativeHandles.getElementImperativeHandles(state.elementImperativeHandles)
}

export function getElementImperativeHandlesContainingElement(
  state: State,
  element: Element,
): Map<string, Map<string, ElementImperativeHandle>> {
  const elementImperativeHandles = getElementImperativeHandles(state)
  const filteredElementImperativeHandles = new Map<string, Map<string, ElementImperativeHandle>>()

  for (const [documentKey, byElementKey] of elementImperativeHandles) {
    const filteredByElementKey = new Map<string, ElementImperativeHandle>()

    for (const [elementKey, elementImperativeHandle] of byElementKey) {
      const handleElement = elementImperativeHandle.getDomNode()

      if (handleElement?.contains(element)) {
        filteredByElementKey.set(elementKey, elementImperativeHandle)
      }
    }

    if (filteredByElementKey.size > 0) {
      filteredElementImperativeHandles.set(documentKey, filteredByElementKey)
    }
  }

  return filteredElementImperativeHandles
}

export function setupBuilderProxy(
  builderProxy: BuilderAPIProxy,
): ThunkAction<void, State, unknown, Action> {
  return dispatch => {
    builderProxy.setup({ onHostAction: action => dispatch(action) })
  }
}
