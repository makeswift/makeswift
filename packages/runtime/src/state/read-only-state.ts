import { type ThunkDispatch } from '@reduxjs/toolkit'

import { createSelector } from 'reselect'

import * as SiteVersion from './modules/site-version'
import * as Locale from './modules/locale'
import * as Documents from './modules/read-only-documents'
import * as ElementTrees from './modules/element-trees'
import * as ReactComponents from './modules/react-components'
import * as ComponentsMeta from './modules/components-meta'
import * as PropControllerDescriptors from './modules/prop-controller-descriptors'
import * as IsInBuilder from './modules/is-in-builder'
import * as IsReadOnly from './modules/is-read-only'
import * as BuilderEditMode from './modules/builder-edit-mode'
import * as Breakpoints from './modules/breakpoints'

import { type Action } from './actions'

export type {
  Data,
  Document,
  DocumentReference,
  Element,
  ElementData,
  ElementReference,
} from './modules/read-only-documents'

export {
  createBaseDocument,
  createDocumentReference,
  getRootElement,
  isElementReference,
} from './modules/read-only-documents'

export type { ComponentType } from './modules/react-components'
export type { ComponentMeta } from './modules/components-meta'

export const reducers = {
  siteVersion: SiteVersion.reducer,
  isReadOnly: IsReadOnly.reducer,
  locale: Locale.reducer,
  documents: Documents.reducer,
  elementTrees: ElementTrees.reducer,
  reactComponents: ReactComponents.reducer,
  componentsMeta: ComponentsMeta.reducer,
  propControllerDescriptors: PropControllerDescriptors.reducer,
  isInBuilder: IsInBuilder.reducer,
  builderEditMode: BuilderEditMode.reducer,
  breakpoints: Breakpoints.reducer,
}

export type State = {
  siteVersion: SiteVersion.State
  isReadOnly: IsReadOnly.State
  locale: Locale.State
  documents: Documents.State
  elementTrees: ElementTrees.State
  reactComponents: ReactComponents.State
  componentsMeta: ComponentsMeta.State
  propControllerDescriptors: PropControllerDescriptors.State
  isInBuilder: IsInBuilder.State
  builderEditMode: BuilderEditMode.State
  breakpoints: Breakpoints.State
}

export type Dispatch = ThunkDispatch<State, unknown, Action>

function getDocumentsStateSlice(state: State): Documents.State {
  return state.documents
}

export function getDocument(state: State, documentKey: string): Documents.Document | null {
  return Documents.getDocument(getDocumentsStateSlice(state), documentKey)
}

function getElementTreesSlice(state: State): ElementTrees.State {
  return state.elementTrees
}

export function getElements(
  state: State,
  documentKey: string,
): ElementTrees.ElementTree['elements'] {
  return ElementTrees.getElements(getElementTreesSlice(state), documentKey)
}

export function getElementIds(
  state: State,
  documentKey: string,
): ElementTrees.ElementTree['elementIds'] {
  return ElementTrees.getElementIds(getElementTreesSlice(state), documentKey)
}

function getReactComponentsStateSlice(state: State): ReactComponents.State {
  return state.reactComponents
}

export function getReactComponent(
  state: State,
  type: string,
): ReactComponents.ComponentType | null {
  return ReactComponents.getReactComponent(getReactComponentsStateSlice(state), type)
}

function getComponentsMetaStateSlice(state: State): ComponentsMeta.State {
  return state.componentsMeta
}

export function getComponentsMeta(state: State): Map<string, ComponentsMeta.ComponentMeta> {
  return ComponentsMeta.getComponentsMeta(getComponentsMetaStateSlice(state))
}

export function getComponentMeta(state: State, type: string): ComponentsMeta.ComponentMeta | null {
  return ComponentsMeta.getComponentMeta(getComponentsMetaStateSlice(state), type)
}

function getPropControllerDescriptorsStateSlice(state: State): PropControllerDescriptors.State {
  return state.propControllerDescriptors
}

export function getPropControllerDescriptors(state: State): PropControllerDescriptors.State {
  return PropControllerDescriptors.getPropControllerDescriptors(
    getPropControllerDescriptorsStateSlice(state),
  )
}

export function getComponentPropControllerDescriptors(
  state: State,
  componentType: string,
): PropControllerDescriptors.DescriptorsByProp | null {
  return PropControllerDescriptors.getComponentPropControllerDescriptors(
    getPropControllerDescriptorsStateSlice(state),
    componentType,
  )
}

/**
 * Returns all document keys sorted by depth, i.e., parent documents come before child documents.
 */
export const getDocumentKeysSortedByDepth: (state: State) => string[] = createSelector(
  [getDocumentsStateSlice, getElementTreesSlice],
  (documents, elementTrees) => {
    return [...documents.keys()].sort((a, b) => (elementTrees.get(a)?.elements.has(b) ? -1 : 1))
  },
)

export function getElement(
  state: State,
  documentKey: string,
  elementKey: string,
): Documents.Element | null {
  return ElementTrees.getElement(getElementTreesSlice(state), documentKey, elementKey)
}

export function getElementId(state: State, documentKey: string, elementKey: string): string | null {
  return ElementTrees.getElementId(getElementTreesSlice(state), documentKey, elementKey)
}

export function getElementPropControllerDescriptors(
  state: State,
  documentKey: string,
  elementKey: string,
): Record<string, PropControllerDescriptors.PropControllerDescriptor> | null {
  const element = getElement(state, documentKey, elementKey)

  if (element == null || Documents.isElementReference(element)) return null

  return getComponentPropControllerDescriptors(state, element.type)
}

export function getIsInBuilder(state: State): boolean {
  return state.isInBuilder
}

export function getIsReadOnly(state: State): boolean {
  return state.isReadOnly
}

export function getBuilderEditMode(state: State): BuilderEditMode.State {
  return state.builderEditMode
}

function getBreakpointsStateSlice(state: State): Breakpoints.State {
  return state.breakpoints
}

export function getBreakpoints(state: State): Breakpoints.Breakpoints {
  return getBreakpointsStateSlice(state).breakpoints
}

export function getBaseBreakpoint(state: State): Breakpoints.BreakpointId {
  return getBreakpointsStateSlice(state).baseBreakpoint
}

export function getClientBreakpoint(state: State): Breakpoints.BreakpointId {
  return getBreakpointsStateSlice(state).clientBreakpoint
}

export function getLocale(state: State): string | null {
  return state.locale
}
