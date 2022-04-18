import {
  applyMiddleware,
  combineReducers,
  createStore,
  PreloadedState,
  Store as ReduxStore,
} from 'redux'
import thunk, { ThunkDispatch } from 'redux-thunk'

import * as Documents from './modules/read-only-documents'
import * as ReactComponents from './modules/react-components'
import * as ComponentsMeta from './modules/components-meta'
import * as PropControllers from './modules/prop-controllers'
import * as Introspection from '../prop-controllers/introspection'
import { Action } from './actions'

export type {
  Data,
  Document,
  DocumentReference,
  Element,
  ElementData,
  ElementReference,
} from './modules/read-only-documents'
export {
  createDocument,
  createDocumentReference,
  isElementReference,
} from './modules/read-only-documents'
export type { ComponentType } from './modules/react-components'

const reducer = combineReducers({
  documents: Documents.reducer,
  reactComponents: ReactComponents.reducer,
  componentsMeta: ComponentsMeta.reducer,
  propControllers: PropControllers.reducer,
  isInBuilder: (_state: boolean = false, _action: Action): boolean => false,
})

export type State = ReturnType<typeof reducer>

function getDocumentsStateSlice(state: State): Documents.State {
  return state.documents
}

export function getDocument(state: State, documentKey: string): Documents.Document | null {
  return Documents.getDocument(getDocumentsStateSlice(state), documentKey)
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

function getPropControllersStateSlice(state: State): PropControllers.State {
  return state.propControllers
}

function getPropControllerDescriptors(
  state: State,
): Map<string, Record<string, PropControllers.PropControllerDescriptor>> {
  return PropControllers.getPropControllerDescriptors(getPropControllersStateSlice(state))
}

export function getComponentPropControllerDescriptors(
  state: State,
  componentType: string,
): Record<string, PropControllers.PropControllerDescriptor> | null {
  return PropControllers.getComponentPropControllerDescriptors(
    getPropControllersStateSlice(state),
    componentType,
  )
}

function normalizeElement(
  element: Documents.Element,
  descriptors: Map<string, Record<string, PropControllers.PropControllerDescriptor>>,
): Map<string, Documents.Element> {
  const elements = new Map<string, Documents.Element>()
  const remaining = [element]
  let current: Documents.Element | undefined

  while ((current = remaining.pop())) {
    elements.set(current.key, current)

    if (Documents.isElementReference(current)) continue

    const elementDescriptors = descriptors.get(current.type)

    if (elementDescriptors == null) continue

    const parent = current
    const children = Object.entries(elementDescriptors).reduce((acc, [propName, descriptor]) => {
      return [...acc, ...Introspection.getElementChildren(descriptor, parent.props[propName])]
    }, [] as Documents.Element[])

    remaining.push(...children)
  }

  return elements
}

function getDocumentElements(state: State, documentKey: string): Map<string, Documents.Element> {
  const document = getDocument(state, documentKey)
  const descriptors = getPropControllerDescriptors(state)

  if (document == null) return new Map()

  return normalizeElement(document.rootElement, descriptors)
}

export function getElement(
  state: State,
  documentKey: string,
  elementKey: string,
): Documents.Element | null {
  return getDocumentElements(state, documentKey).get(elementKey) ?? null
}

export function getElementPropControllerDescriptors(
  state: State,
  documentKey: string,
  elementKey: string,
): Record<string, PropControllers.PropControllerDescriptor> | null {
  const element = getElement(state, documentKey, elementKey)

  if (element == null || Documents.isElementReference(element)) return null

  return getComponentPropControllerDescriptors(state, element.type)
}

export function getElementId(state: State, documentKey: string, elementKey: string): string | null {
  const element = getElement(state, documentKey, elementKey)

  if (element == null || Documents.isElementReference(element)) return null

  const descriptors = getComponentPropControllerDescriptors(state, element.type)

  if (descriptors == null) return null

  const elementId = Object.entries(descriptors).reduce((acc, [propName, descriptor]) => {
    if (acc != null) return acc

    return Introspection.getElementId(descriptor, element.props[propName])
  }, null as string | null)

  return elementId
}

export function getIsInBuilder(state: State): boolean {
  return state.isInBuilder
}

export type Dispatch = ThunkDispatch<State, unknown, Action>

export type Store = ReduxStore<State, Action> & { dispatch: Dispatch }

export function configureStore({
  rootElements,
  preloadedState,
}: {
  rootElements?: Map<string, Documents.Element>
  preloadedState?: PreloadedState<State>
} = {}): Store {
  return createStore(
    reducer,
    { ...preloadedState, documents: Documents.getInitialState({ rootElements }) },
    applyMiddleware(thunk),
  )
}
