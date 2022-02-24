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
import { Action } from './actions'

export type {
  Data,
  Document,
  Element,
  ElementData,
  ElementReference,
} from './modules/read-only-documents'
export { isElementReference } from './modules/read-only-documents'
export type { ComponentType } from './modules/react-components'

const reducer = combineReducers({
  documents: Documents.reducer,
  reactComponents: ReactComponents.reducer,
  componentsMeta: ComponentsMeta.reducer,
  propControllers: PropControllers.reducer,
})

export type State = ReturnType<typeof reducer>

function getDocumentsStateSlice(state: State): Documents.State {
  return state.documents
}

export function getDocumentRootElement(
  state: State,
  documentKey: string,
): Documents.Element | null {
  return Documents.getDocumentRootElement(getDocumentsStateSlice(state), documentKey)
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
