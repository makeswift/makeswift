import {
  applyMiddleware,
  combineReducers,
  createStore,
  type Dispatch as ReduxDispatch,
  type Middleware,
  type MiddlewareAPI,
  type Store as ReduxStore,
} from 'redux'

import { thunk, ThunkDispatch } from 'redux-thunk'
import { createSelector } from 'reselect'

import { composeWithDevToolsDevelopmentOnly } from '@redux-devtools/extension'

import {
  createReplacementContext,
  type SerializableReplacementContext,
  type ReplacementContext,
  type TranslationDto,
  type MergeTranslatableDataContext,
  type MergeContext,
  CopyContext,
  replaceResourceIfNeeded,
  ContextResource,
} from '@makeswift/controls'

import { serializeState } from '../utils/serializeState'

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
import {
  type Action,
  ActionTypes,
  changeElementTree,
  createElementTree,
  deleteElementTree,
} from './actions'
import {
  copy as copyFromControl,
  getTranslatableData,
  merge,
  mergeTranslatedData,
} from '../controls/control'

import { type SetupTeardownMixin, withSetupTeardown } from './mixins/setup-teardown'

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

const reducer = combineReducers({
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
})

export type State = ReturnType<typeof reducer>

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

export function getPropControllers(state: State, documentKey: string, elementKey: string) {
  return PropControllerHandles.getPropControllers(
    getPropControllerHandlesStateSlice(state),
    documentKey,
    elementKey,
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

export function getElementTreeTranslatableData(
  state: State,
  elementTree: Documents.ElementData,
): Record<string, Documents.Data> {
  const translatableData: Record<string, Documents.Data> = {}
  const descriptors = getPropControllerDescriptors(state)

  for (const element of ElementTrees.traverseElementTree(elementTree, descriptors)) {
    if (Documents.isElementReference(element)) continue

    const elementPescriptors = descriptors.get(element.type)
    if (elementPescriptors == null) continue

    Object.entries(elementPescriptors).forEach(([propName, descriptor]) => {
      const translatablePropData = getTranslatableData(descriptor, element.props[propName])

      if (translatablePropData != null) {
        translatableData[`${element.key}:${propName}`] = translatablePropData
      }
    })
  }

  return translatableData
}

export function mergeElementTreeTranslatedData(
  state: State,
  elementTree: Documents.ElementData,
  translatedData: TranslationDto,
): Documents.Element {
  function merge(state: State, translatedData: TranslationDto) {
    return function (node: Documents.Element): Documents.Element {
      if (Documents.isElementReference(node)) return node

      const elementDescriptors = getPropControllerDescriptors(state)
      const descriptors = elementDescriptors.get(node.type)

      if (descriptors == null) {
        throw new Error(`Can't merge element of type "${node.type}" because it has no descriptors`)
      }

      const context: MergeTranslatableDataContext = {
        translatedData,
        mergeTranslatedData: merge(state, translatedData),
      }
      const props = {} as Record<string, Documents.Data>

      for (const propName of Object.keys(descriptors)) {
        const descriptor = descriptors[propName]

        props[propName] = mergeTranslatedData(
          descriptor,
          node.props[propName],
          translatedData[`${node.key}:${propName}`],
          context,
        )
      }

      return { ...node, props }
    }
  }
  return merge(state, translatedData)(elementTree)
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

export type Dispatch = ThunkDispatch<State, unknown, Action>

export type Store = ReduxStore<State, Action> & { dispatch: Dispatch } & SetupTeardownMixin

export function elementTreeMiddleware(): Middleware<Dispatch, State, Dispatch> {
  return ({ dispatch, getState }: MiddlewareAPI<Dispatch, State>) =>
    (next: ReduxDispatch<Action>) => {
      return (action: Action): Action => {
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
    }
}

export function configureStore({
  name,
  preloadedState,
  breakpoints,
  middleware,
}: {
  name: string
  preloadedState: Partial<State> | null
  breakpoints?: Breakpoints.State
  middleware?: Middleware[]
}): Store {
  const composeEnhancers = composeWithDevToolsDevelopmentOnly({
    name: `${name} (${new Date().toISOString()})`,
    serialize: true,
    stateSanitizer: (state: any) => serializeState(state),
  })

  return createStore(
    reducer,
    {
      ...preloadedState,
      breakpoints: Breakpoints.getInitialState(breakpoints ?? preloadedState?.breakpoints),
    },
    composeEnhancers(
      withSetupTeardown(
        () => {},
        () => {},
      ),
      applyMiddleware(thunk, elementTreeMiddleware(), ...(middleware ?? [])),
    ),
  )
}
