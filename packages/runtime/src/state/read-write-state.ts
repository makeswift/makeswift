import { combineReducers, type ThunkDispatch } from '@reduxjs/toolkit'

import * as Documents from './modules/read-write-documents'
import * as BoxModels from './modules/box-models'
import * as Pointer from './modules/pointer'
import * as ElementImperativeHandles from './modules/element-imperative-handles'
import * as Breakpoints from './modules/breakpoints'

import { type Action } from './actions'

import { ElementImperativeHandle } from '../runtimes/react/element-imperative-handle'

import * as ReadOnlyState from './read-only-state'

export type { Operation } from './modules/read-write-documents'
export type { BoxModelHandle } from './modules/box-models'
export { createBox, getBox, parse } from './modules/box-models'

const reducers = {
  ...ReadOnlyState.reducers,
  documents: Documents.reducer,
  boxModels: BoxModels.reducer,
  pointer: Pointer.reducer,
  elementImperativeHandles: ElementImperativeHandles.reducer,
  breakpoints: Breakpoints.reducer,
}

export function createRootReducer() {
  return combineReducers(reducers)
}

export type State = ReadOnlyState.State & {
  documents: Documents.State
  boxModels: BoxModels.State
  pointer: Pointer.State
  elementImperativeHandles: ElementImperativeHandles.State
  breakpoints: Breakpoints.State
}

export type Dispatch = ThunkDispatch<State, unknown, Action>

function getDocumentsStateSlice(state: State): Documents.State {
  return state.documents
}

export function getDocuments(state: State): Documents.State {
  return Documents.getDocuments(getDocumentsStateSlice(state))
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
