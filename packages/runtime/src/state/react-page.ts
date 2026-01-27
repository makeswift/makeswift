import {
  configureStore as configureReduxStore,
  combineReducers,
  type ThunkDispatch,
  type Middleware,
} from '@reduxjs/toolkit'

import { createSelector } from 'reselect'

import {
  createReplacementContext,
  type SerializableReplacementContext,
  type ReplacementContext,
  type MergeContext,
  CopyContext,
  replaceResourceIfNeeded,
  ContextResource,
} from '@makeswift/controls'

import { copy as copyFromControl, merge } from '../controls/control'

import * as Documents from './modules/read-only-documents'
import * as ElementTrees from './modules/element-trees'
import * as ReactComponents from './modules/react-components'
import * as ComponentsMeta from './modules/components-meta'
import * as PropControllers from './modules/prop-controllers'
import * as PropControllerHandles from './modules/prop-controller-handles'
import * as IsInBuilder from './modules/is-in-builder'
import * as IsPreview from './modules/is-preview'
import * as BuilderEditMode from './modules/builder-edit-mode'
import * as Breakpoints from './modules/breakpoints'

import { type Action, ActionTypes } from './actions'
import { changeElementTree, createElementTree, deleteElementTree } from './actions/internal'

import { actionMiddleware, middlewareOptions, devToolsConfig } from './toolkit'

import { withSetupTeardown } from './mixins/setup-teardown'

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
  documents: Documents.reducer,
  elementTrees: ElementTrees.reducer,
  reactComponents: ReactComponents.reducer,
  componentsMeta: ComponentsMeta.reducer,
  propControllers: PropControllers.reducer,
  propControllerHandles: PropControllerHandles.reducer,
  isInBuilder: IsInBuilder.reducer,
  isPreview: IsPreview.reducer,
  builderEditMode: BuilderEditMode.reducer,
  breakpoints: Breakpoints.reducer,
}

export type State = {
  documents: Documents.State
  elementTrees: ElementTrees.State
  reactComponents: ReactComponents.State
  componentsMeta: ComponentsMeta.State
  propControllers: PropControllers.State
  propControllerHandles: PropControllerHandles.State
  isInBuilder: IsInBuilder.State
  isPreview: IsPreview.State
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

function getPropControllersStateSlice(state: State): PropControllers.State {
  return state.propControllers
}

export function getPropControllerDescriptors(state: State): PropControllers.State {
  return PropControllers.getPropControllerDescriptors(getPropControllersStateSlice(state))
}

export function getComponentPropControllerDescriptors(
  state: State,
  componentType: string,
): PropControllers.DescriptorsByProp | null {
  return PropControllers.getComponentPropControllerDescriptors(
    getPropControllersStateSlice(state),
    componentType,
  )
}

function getPropControllerHandlesStateSlice(state: State): PropControllerHandles.State {
  return state.propControllerHandles
}

export function getPropControllers(
  state: State,
  { documentKey, elementKey }: { documentKey: string; elementKey: string },
) {
  return PropControllerHandles.getPropControllers(
    getPropControllerHandlesStateSlice(state),
    documentKey,
    elementKey,
  )
}

export function getPropControllersHandle(
  state: State,
  { documentKey, elementKey }: { documentKey: string; elementKey: string },
) {
  return PropControllerHandles.getPropControllersHandle(
    getPropControllerHandlesStateSlice(state),
    documentKey,
    elementKey,
  )
}

export function getPropController(
  state: State,
  {
    documentKey,
    elementKey,
    propName,
  }: { documentKey: string; elementKey: string; propName: string },
) {
  return PropControllerHandles.getPropController(
    getPropControllerHandlesStateSlice(state),
    documentKey,
    elementKey,
    propName,
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
): Record<string, PropControllers.PropControllerDescriptor> | null {
  const element = getElement(state, documentKey, elementKey)

  if (element == null || Documents.isElementReference(element)) return null

  return getComponentPropControllerDescriptors(state, element.type)
}

export function copyElementTree(
  state: State,
  elementTree: Documents.ElementData,
  replacementContext: SerializableReplacementContext,
) {
  /*
   * This is structured a bit weird.
   *
   * This is done so that we can pass a callable function into some of the copy functions
   * themselves, to enable mutual recursion.
   *
   * Consider the slot control. It has to iterate through its elements, and for each of them,
   * call some version of the below function.
   *
   * That is how the recursing through the tree happens.
   */
  function copyElementTreeNode(state: State, replacementContext: ReplacementContext) {
    return function (node: Documents.Element) {
      const context: CopyContext = {
        replacementContext,
        copyElement: copyElementTreeNode(state, replacementContext),
      }

      if (Documents.isElementReference(node)) {
        return {
          ...node,
          value: replaceResourceIfNeeded(ContextResource.GlobalElement, node.value, context),
        }
      }

      const descriptors = getComponentPropControllerDescriptors(state, node.type)

      if (descriptors == null) return node

      for (const [propKey, descriptor] of Object.entries(descriptors)) {
        node.props[propKey] = copyFromControl(descriptor, node.props[propKey], context)
      }

      return node
    }
  }

  const copy = JSON.parse(JSON.stringify(elementTree)) as Documents.ElementData

  return copyElementTreeNode(state, createReplacementContext(replacementContext))(copy)
}

export function mergeElement(
  state: State,
  baseElement: Documents.Element,
  overrideElement: Documents.Element,
): Documents.Element {
  if (baseElement.type !== overrideElement.type || baseElement.key !== overrideElement.key) {
    throw new Error(`Can't merge elements of different types or keys`)
  }

  if (Documents.isElementReference(overrideElement)) return overrideElement

  if (Documents.isElementReference(baseElement)) return baseElement

  const elementDescriptors = getPropControllerDescriptors(state)
  const descriptors = elementDescriptors.get(baseElement.type)

  if (descriptors == null) {
    throw new Error(
      `Can't merge element of type "${baseElement.type}" because it has no descriptors`,
    )
  }

  const mergedProps = {} as Record<string, Documents.Data>

  for (const propName of Object.keys(descriptors)) {
    const descriptor = descriptors[propName]
    const context: MergeContext = {
      mergeElement(base, override) {
        return mergeElement(state, base, override)
      },
    }

    mergedProps[propName] = merge(
      descriptor,
      baseElement.props[propName],
      overrideElement.props[propName],
      context,
    )
  }

  return { ...baseElement, props: mergedProps }
}

export function getIsInBuilder(state: State): boolean {
  return state.isInBuilder
}

export function getIsPreview(state: State): boolean {
  return IsPreview.getIsPreview(state.isPreview)
}

export function getBuilderEditMode(state: State): BuilderEditMode.State {
  return state.builderEditMode
}

export function getBreakpoints(state: State): Breakpoints.State {
  return state.breakpoints
}

export function elementTreeMiddleware(): Middleware<Dispatch, State, Dispatch> {
  return actionMiddleware(({ dispatch, getState }) => next => {
    return action => {
      switch (action.type) {
        case ActionTypes.REGISTER_DOCUMENT:
          dispatch(
            createElementTree({
              document: action.payload.document,
              descriptors: getPropControllerDescriptors(getState()),
            }),
          )
          break

        case ActionTypes.CHANGE_DOCUMENT: {
          const { documentKey, operation } = action.payload

          const oldDocument = getDocument(getState(), documentKey)
          const result = next(action)
          const newDocument = getDocument(getState(), documentKey)

          if (oldDocument != null && newDocument != null && newDocument !== oldDocument) {
            dispatch(
              changeElementTree({
                oldDocument,
                newDocument,
                descriptors: getPropControllerDescriptors(getState()),
                operation,
              }),
            )
          }

          return result
        }

        case ActionTypes.UNREGISTER_DOCUMENT:
          dispatch(deleteElementTree(action.payload))
          break
      }

      return next(action)
    }
  })
}

export function configureStore({
  name,
  preloadedState,
  breakpoints,
  middlewares = [],
}: {
  name: string
  preloadedState: Partial<State> | null
  breakpoints?: Breakpoints.State
  middlewares?: Middleware<Dispatch, State, Dispatch>[]
}) {
  return configureReduxStore({
    reducer: combineReducers(reducers),
    preloadedState: {
      ...preloadedState,
      breakpoints: Breakpoints.getInitialState(breakpoints ?? preloadedState?.breakpoints),
    },

    middleware: getDefaultMiddleware =>
      getDefaultMiddleware(middlewareOptions).concat(elementTreeMiddleware(), ...middlewares),

    enhancers: getDefaultEnhancers =>
      getDefaultEnhancers().concat(
        withSetupTeardown(
          () => {},
          () => {},
        ),
      ),

    devTools: devToolsConfig({
      name: `${name} (${new Date().toISOString()})`,
    }),
  })
}

export type Store = ReturnType<typeof configureStore>
