import {
  applyMiddleware,
  combineReducers,
  createStore,
  PreloadedState,
  Store as ReduxStore,
} from 'redux'

import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'

import { ControlDefinition } from '../controls'
import { controlTraitsRegistry, ResourceResolver } from '@makeswift/controls'

import * as Documents from './modules/read-only-documents'
import * as ReactComponents from './modules/react-components'
import * as ComponentsMeta from './modules/components-meta'
import * as ComponentProps from './modules/component-props'
import * as PropControllers from './modules/prop-controllers'
import * as PropControllerHandles from './modules/prop-controller-handles'
import * as IsInBuilder from './modules/is-in-builder'
import * as IsPreview from './modules/is-preview'
import * as BuilderEditMode from './modules/builder-edit-mode'
import * as Breakpoints from './modules/breakpoints'
import * as Introspection from '../prop-controllers/introspection'
import { Action, setComponentProp } from './actions'
import { copyElementReference } from '../prop-controllers/copy'
import {
  copy as copyFromControl,
  getTranslatableData,
  merge,
  mergeTranslatedData,
} from '../controls/control'

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
  propControllerHandles: PropControllerHandles.reducer,
  isInBuilder: IsInBuilder.reducer,
  isPreview: IsPreview.reducer,
  builderEditMode: BuilderEditMode.reducer,
  breakpoints: Breakpoints.reducer,
  componentProps: ComponentProps.reducer,
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

function getComponentPropsStateSlice(state: State): ComponentProps.State {
  return state.componentProps
}

export function getComponentProps(state: State, elementKey: string): ComponentProps.Props | null {
  return ComponentProps.getComponentProps(getComponentPropsStateSlice(state), elementKey)
}

function getPropControllersStateSlice(state: State): PropControllers.State {
  return state.propControllers
}

export function getPropControllerDescriptors(
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

/**
 * Returns all document keys sorted by depth, i.e., parent documents come before child documents.
 *
 * @todo Make this selector more efficient.
 */
export function getDocumentKeysSortedByDepth(state: State): string[] {
  const documents = Documents.getDocuments(getDocumentsStateSlice(state))
  const keys = Array.from(documents.keys())

  if (keys.length < 2) return keys

  const elements = new Map<string, Map<string, Documents.Element>>()

  keys.forEach(key => {
    elements.set(key, getDocumentElements(state, key))
  })

  keys.sort((a, b) => (elements.get(a)?.has(b) ? -1 : 1))

  return keys
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

  const elementId = Object.entries(descriptors).reduce(
    (acc, [propName, descriptor]) => {
      if (acc != null) return acc

      return Introspection.getElementId(descriptor, element.props[propName])
    },
    null as string | null,
  )

  return elementId
}

export type ReplacementContext = {
  elementHtmlIds: Set<string>
  elementKeys: Map<string, string>
  swatchIds: Map<string, string>
  fileIds: Map<string, string>
  typographyIds: Map<string, string>
  tableIds: Map<string, string>
  tableColumnIds: Map<string, string>
  pageIds: Map<string, string>
  globalElementIds: Map<string, string>
  globalElementData: Map<string, Documents.ElementData>
}

export type SerializableReplacementContext = {
  elementHtmlIds: string[]
  elementKeys: { [s: string]: string }
  swatchIds: { [s: string]: string }
  fileIds: { [s: string]: string }
  typographyIds: { [s: string]: string }
  tableIds: { [s: string]: string }
  tableColumnIds: { [s: string]: string }
  pageIds: { [s: string]: string }
  globalElementIds: { [s: string]: string }
  globalElementData: { [s: string]: Documents.ElementData }
}

export function createReplacementContext(
  serializableReplacementContext: SerializableReplacementContext,
): ReplacementContext {
  const rc: ReplacementContext = {
    elementHtmlIds: new Set(serializableReplacementContext.elementHtmlIds),
    elementKeys: new Map(
      serializableReplacementContext.elementKeys &&
        Object.entries(serializableReplacementContext.elementKeys),
    ),
    swatchIds: new Map(
      serializableReplacementContext.swatchIds &&
        Object.entries(serializableReplacementContext.swatchIds),
    ),
    fileIds: new Map(
      serializableReplacementContext.fileIds &&
        Object.entries(serializableReplacementContext.fileIds),
    ),
    typographyIds: new Map(
      serializableReplacementContext.typographyIds &&
        Object.entries(serializableReplacementContext.typographyIds),
    ),
    tableIds: new Map(
      serializableReplacementContext.tableIds &&
        Object.entries(serializableReplacementContext.tableIds),
    ),
    tableColumnIds: new Map(
      serializableReplacementContext.tableColumnIds &&
        Object.entries(serializableReplacementContext.tableColumnIds),
    ),
    pageIds: new Map(
      serializableReplacementContext.pageIds &&
        Object.entries(serializableReplacementContext.pageIds),
    ),
    globalElementIds: new Map(
      serializableReplacementContext.globalElementIds &&
        Object.entries(serializableReplacementContext.globalElementIds),
    ),
    globalElementData: new Map(
      serializableReplacementContext.globalElementData &&
        Object.entries(serializableReplacementContext.globalElementData),
    ),
  }

  return rc
}

export type CopyContext = {
  replacementContext: ReplacementContext
  copyElement: (node: Documents.Element) => Documents.Element
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
      const context = {
        replacementContext,
        copyElement: copyElementTreeNode(state, replacementContext),
      }

      if (Documents.isElementReference(node)) {
        return { ...node, value: copyElementReference(node.value, context) }
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

function* traverseElementTree(
  state: State,
  elementTree: Documents.ElementData,
): Generator<Documents.Element> {
  yield elementTree

  if (Documents.isElementReference(elementTree)) return

  const descriptors = getComponentPropControllerDescriptors(state, elementTree.type)

  if (descriptors == null) return

  for (const [propKey, descriptor] of Object.entries(descriptors)) {
    const children = Introspection.getElementChildren(descriptor, elementTree.props[propKey])

    for (const child of children) {
      if (!Documents.isElementReference(child)) yield* traverseElementTree(state, child)

      yield child
    }
  }
}

export function getElementTreeTranslatableData(
  state: State,
  elementTree: Documents.ElementData,
): Record<string, Documents.Data> {
  const translatableData: Record<string, Documents.Data> = {}

  for (const element of traverseElementTree(state, elementTree)) {
    if (Documents.isElementReference(element)) continue

    const descriptors = getComponentPropControllerDescriptors(state, element.type)

    if (descriptors == null) continue

    Object.entries(descriptors).forEach(([propName, descriptor]) => {
      const translatablePropData = getTranslatableData(descriptor, element.props[propName])

      if (translatablePropData != null) {
        translatableData[`${element.key}:${propName}`] = translatablePropData
      }
    })
  }

  return translatableData
}

export type TranslationDto = Record<string, Documents.Data>

export type MergeTranslatableDataContext = {
  translatedData: TranslationDto
  mergeTranslatedData: (node: Documents.Element) => Documents.Element
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

export type MergeContext = {
  mergeElement(a: Documents.Element, b: Documents.Element): Documents.Element
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
//type Thunk<ReturnType> = ThunkAction<ReturnType, State, unknown, Action>
// Thunk<Promise<Extract<APIResource, { __typename: T }> | null>> {
export function resolveComponentProp(
  elementKey: string,
  propName: string,
  elementData: Documents.Data,
  definition: { type: string },
  resourceResolver: ResourceResolver,
): ThunkAction<Promise<void>, State, unknown, Action> {
  return async (dispatch, getState) => {
    const state = getComponentPropsStateSlice(getState())

    if (ComponentProps.hasComponentProp(state, elementKey, propName)) {
      return
      // return ComponentProps.getComponentProp(state, elementKey, propName)
    }

    // return null
    // let resource: APIResource | null

    // switch (resourceType) {
    //   case APIResourceType.Swatch:
    //     resource = await fetchJson<Swatch>(`/api/makeswift/swatches/${resourceId}`)
    //     break

    //   case APIResourceType.File:
    //     resource = await fetchJson<File>(`/api/makeswift/files/${resourceId}`)
    //     break

    //   case APIResourceType.Typography:
    //     resource = await fetchJson<Typography>(`/api/makeswift/typographies/${resourceId}`)
    //     break

    //   default:
    //     resource = null
    // }

    const traits = controlTraitsRegistry.get(definition.type)
    if (traits) {
      const controlValue = traits.fromData(elementData, definition as any)
      const value = await traits.resolveValue(controlValue, definition as any, resourceResolver)

      dispatch(setComponentProp(elementKey, propName, value))
    }
    // return resource as Extract<APIResource, { __typename: T }> | null
  }
}

export type Dispatch = ThunkDispatch<State, unknown, Action>

export type Store = ReduxStore<State, Action> & { dispatch: Dispatch }

export function configureStore({
  rootElements,
  preloadedState,
  breakpoints,
}: {
  rootElements?: Map<string, Documents.Element>
  preloadedState?: PreloadedState<State>
  breakpoints?: Breakpoints.State
} = {}): Store {
  return createStore(
    reducer,
    {
      ...preloadedState,
      documents: Documents.getInitialState({ rootElements }),
      breakpoints: Breakpoints.getInitialState(breakpoints ?? preloadedState?.breakpoints),
    },
    applyMiddleware(thunk),
  )
}
