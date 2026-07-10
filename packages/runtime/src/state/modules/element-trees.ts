import { type Operation } from 'ot-json0'
import { getIn, removeIn, setIn } from 'immutable'

import { type Element, type ElementData, isElementReference } from '@makeswift/controls'

import * as Introspection from '../../prop-controllers/introspection'

import { type Action, type UnknownAction, isKnownAction } from '../actions'

import { ReadOnlyActionTypes } from '../actions/internal/read-only-actions'
import { ReadWriteActionTypes } from '../actions/internal/read-write-actions'

import { getRootElement, type Document } from './read-only-documents'
import { type DescriptorsByComponentType } from './prop-controllers'

export type ElementTree = {
  elements: Map<string, Element>
  elementIds: Map<string, string>
}

export type State = Map<string, ElementTree>

export function getInitialState(
  documents?: Map<string, Document>,
  descriptors?: DescriptorsByComponentType,
): State {
  const state = new Map<string, ElementTree>()
  if (documents == null || descriptors == null) return state

  for (const [documentKey, document] of documents) {
    state.set(documentKey, buildElementTree(getRootElement(document), descriptors))
  }

  return state
}

function getElementTree(state: State, documentKey: string): ElementTree | null {
  return state.get(documentKey) ?? null
}

export function getElements(state: State, documentKey: string): Map<string, Element> {
  return getElementTree(state, documentKey)?.elements ?? new Map()
}

export function getElementIds(state: State, documentKey: string): Map<string, string> {
  return getElementTree(state, documentKey)?.elementIds ?? new Map()
}

export function getElement(state: State, documentKey: string, elementKey: string): Element | null {
  return getElements(state, documentKey).get(elementKey) ?? null
}

export function getElementId(state: State, documentKey: string, elementKey: string): string | null {
  return getElementIds(state, documentKey).get(elementKey) ?? null
}

export function reducer(state: State = getInitialState(), action: Action | UnknownAction): State {
  if (!isKnownAction(action)) return state

  switch (action.type) {
    case ReadOnlyActionTypes.CREATE_ELEMENT_TREE: {
      const { document, descriptors } = action.payload
      return new Map(state).set(
        document.key,
        buildElementTree(getRootElement(document), descriptors),
      )
    }

    case ReadOnlyActionTypes.DELETE_ELEMENT_TREE: {
      const nextState = new Map(state)
      const deleted = nextState.delete(action.payload.documentKey)
      return deleted ? nextState : state
    }

    case ReadWriteActionTypes.CHANGE_ELEMENT_TREE: {
      const { oldDocument, newDocument, descriptors, operation } = action.payload
      const documentKey = oldDocument.key
      console.assert(
        documentKey === newDocument.key,
        `Mismatching document keys ${documentKey} !== ${newDocument.key}`,
      )

      const elementTree = state.get(documentKey)
      if (elementTree == null) return state

      const updatedElementTree = applyChanges(
        elementTree,
        descriptors,
        {
          old: getRootElement(oldDocument),
          new: getRootElement(newDocument),
        },
        operation,
      )

      return new Map(state).set(documentKey, updatedElementTree)
    }

    default:
      return state
  }
}

export function* traverseElementTree(
  element: Element,
  descriptors: DescriptorsByComponentType,
): Generator<Element> {
  yield element
  if (isElementReference(element)) return

  const elementDescriptors = descriptors.get(element.type)
  if (elementDescriptors == null) return

  for (const [propKey, descriptor] of Object.entries(elementDescriptors)) {
    const children = Introspection.getElementChildren(descriptor, element.props[propKey])
    for (const child of children) {
      yield* traverseElementTree(child, descriptors)
    }
  }
}

function getElementIdProp(
  element: ElementData,
  descriptors: DescriptorsByComponentType,
): string | null {
  const elementDescriptors = descriptors.get(element.type)
  if (elementDescriptors == null) return null

  for (const [propName, descriptor] of Object.entries(elementDescriptors)) {
    const elementId = Introspection.getElementId(descriptor, element.props[propName])
    if (elementId != null) return elementId
  }

  return null
}

export function buildElementTree(
  rootElement: Element,
  descriptors: DescriptorsByComponentType,
): ElementTree {
  const elements = new Map<string, Element>()
  const elementIds = new Map<string, string>()

  for (const element of traverseElementTree(rootElement, descriptors)) {
    elements.set(element.key, element)
    if (!isElementReference(element)) {
      const elementId = getElementIdProp(element, descriptors)
      if (elementId != null) elementIds.set(element.key, elementId)
    }
  }

  return {
    elements,
    elementIds,
  }
}

type OperationPath = Operation[number]['p']

// performance-sensitive function, intentionally not using `elementData` schema here
function isElement(item: unknown): item is Element {
  return (
    typeof item === 'object' &&
    item != null &&
    'key' in item &&
    'type' in item &&
    typeof item.key === 'string' &&
    typeof item.type === 'string'
  )
}

type ElementOperationPath = { elementPath: OperationPath; propName: string | null }

function getElementOperationPath(path: OperationPath): ElementOperationPath {
  if (path.length === 0) {
    return { elementPath: [], propName: null }
  }

  const i = path.findLastIndex(
    (fragment, i) =>
      typeof fragment === 'number' && (i === path.length - 1 || path[i + 1] === 'props'),
  )

  if ((i === -1 && path[0] !== 'props') || path.length - i < 3) {
    console.error('Operation path does not point to an element property', { path })
    return { elementPath: [], propName: null }
  }

  return { elementPath: path.slice(0, i + 1), propName: `${path.slice(i + 1).at(1)}` }
}

export function getChangedElementsPaths(
  path: OperationPath,
): [ElementOperationPath, ...ElementOperationPath[]] {
  let elementOp = getElementOperationPath(path)
  const result: [ElementOperationPath, ...ElementOperationPath[]] = [elementOp]
  while (elementOp.elementPath.length > 0) {
    elementOp = getElementOperationPath(elementOp.elementPath.slice(0, -1))
    result.push(elementOp)
  }

  return result
}

function getElementByPath(rootElement: Element, elementPath: OperationPath): Element | null {
  const item = getIn(rootElement, elementPath)
  if (!isElement(item)) {
    console.error('Expected an element, got', item, {
      rootElement,
      elementPath,
    })

    return null
  }

  return item
}

function getElementAndPropName(
  rootElement: Element,
  { elementPath, propName }: ElementOperationPath,
): [Element, string | null] {
  const element = getElementByPath(rootElement, elementPath)
  return element != null ? [element, propName] : [rootElement, null]
}

function updateParentElements(
  elements: ElementTree['elements'],
  elementPaths: ElementOperationPath[],
  rootElement: Element,
): void {
  elementPaths.forEach(({ elementPath }) => {
    const element = getElementByPath(rootElement, elementPath)
    if (element != null) elements.set(element.key, element)
  })
}

function getPropChildren(
  element: Element,
  propName: string,
  descriptors: DescriptorsByComponentType,
): Element[] | null {
  if (isElementReference(element)) return null

  const propDescriptor = descriptors.get(element.type)?.[propName]
  if (propDescriptor == null) return null

  return Introspection.getElementChildren(propDescriptor, element.props[propName])
}

function isChildrenProp(
  element: Element,
  propName: string,
  descriptors: DescriptorsByComponentType,
): boolean {
  const children = getPropChildren(element, propName, descriptors)
  return children != null
}

function deleteElement(
  { elements, elementIds }: ElementTree,
  elementToDelete: Element,
  descriptors: DescriptorsByComponentType,
) {
  for (const element of traverseElementTree(elementToDelete, descriptors)) {
    elements.delete(element.key)
    elementIds.delete(element.key)
  }
}

function deleteChildrenInProp(
  elementTree: ElementTree,
  parentElement: Element,
  propName: string,
  descriptors: DescriptorsByComponentType,
) {
  const childrenInProp = getPropChildren(parentElement, propName, descriptors)

  if (childrenInProp == null) {
    return
  }

  for (const child of childrenInProp) {
    deleteElement(elementTree, child, descriptors)
  }
}

function applyDelete(
  elementTree: ElementTree,
  descriptors: DescriptorsByComponentType,
  rootElements: { before: Element; after: Element },
  path: OperationPath,
): ElementTree {
  const [targetElementPath, ...parentElementPaths] = getChangedElementsPaths(path)
  const [targetElement, propName] = getElementAndPropName(rootElements.before, targetElementPath)

  const elements = new Map(elementTree.elements)
  const elementIds = new Map(elementTree.elementIds)

  if (propName == null) {
    deleteElement({ elements, elementIds }, targetElement, descriptors)
  } else if (isChildrenProp(targetElement, propName, descriptors)) {
    deleteChildrenInProp({ elements, elementIds }, targetElement, propName, descriptors)
  }

  if (propName !== null && !isElementReference(targetElement)) {
    delete targetElement.props[propName]
  }

  // Use the "after" state to efficiently update all of parent subtrees in the state
  updateParentElements(elements, parentElementPaths, rootElements.after)

  return {
    elements,
    elementIds,
  }
}

function insertElement(
  { elements, elementIds }: ElementTree,
  insertedElement: Element,
  propName: string | null,
  descriptors: DescriptorsByComponentType,
) {
  if (propName == null || isChildrenProp(insertedElement, propName, descriptors)) {
    for (const element of traverseElementTree(insertedElement, descriptors)) {
      elements.set(element.key, element)
      if (!isElementReference(element)) {
        const elementId = getElementIdProp(element, descriptors)
        if (elementId != null) elementIds.set(element.key, elementId)
      }
    }
  } else {
    elements.set(insertedElement.key, insertedElement)
    if (!isElementReference(insertedElement)) {
      const elementId = getElementIdProp(insertedElement, descriptors)
      if (elementId != null) elementIds.set(insertedElement.key, elementId)
    }
  }
}

function applyInsert(
  elementTree: ElementTree,
  descriptors: DescriptorsByComponentType,
  rootElements: { before: Element; after: Element },
  path: OperationPath,
): ElementTree {
  const [insertedElementPath, ...parentElementPaths] = getChangedElementsPaths(path)
  const [insertedElement, propName] = getElementAndPropName(rootElements.after, insertedElementPath)

  const elements = new Map(elementTree.elements)
  const elementIds = new Map(elementTree.elementIds)

  insertElement({ elements, elementIds }, insertedElement, propName, descriptors)

  // Use the "after" state to efficiently update all of parent subtrees in the state
  updateParentElements(elements, parentElementPaths, rootElements.after)

  return {
    elements,
    elementIds,
  }
}

function applyUpdate(
  elementTree: ElementTree,
  descriptors: DescriptorsByComponentType,
  rootElements: { before: Element; after: Element },
  path: OperationPath,
): ElementTree {
  const [updateElementPath, ...parentElementPaths] = getChangedElementsPaths(path)
  const [targetElement, propName] = getElementAndPropName(rootElements.before, updateElementPath)
  const [insertedElement, _] = getElementAndPropName(rootElements.after, updateElementPath)

  const elements = new Map(elementTree.elements)
  const elementIds = new Map(elementTree.elementIds)

  if (propName == null) {
    deleteElement({ elements, elementIds }, targetElement, descriptors)
  } else if (isChildrenProp(targetElement, propName, descriptors)) {
    deleteChildrenInProp({ elements, elementIds }, targetElement, propName, descriptors)
  }

  insertElement({ elements, elementIds }, insertedElement, propName, descriptors)

  // Use the "after" state to efficiently update all of parent subtrees in the state
  updateParentElements(elements, parentElementPaths, rootElements.after)

  return {
    elements,
    elementIds,
  }
}

function applyOpComponent(root: Element, component: Operation[number]): Element {
  let applied: Element = root

  if ('ld' in component || 'od' in component) {
    applied = removeIn(applied, component.p)
  }

  if ('li' in component) {
    applied = setIn(applied, component.p, component.li)
  }

  if ('oi' in component) {
    applied = setIn(applied, component.p, component.oi)
  }

  return applied
}

function selectTreeTransform(op: Operation[number]): typeof applyUpdate {
  const hasDelete = 'ld' in op || 'od' in op
  const hasInsert = 'li' in op || 'oi' in op

  if (hasDelete && hasInsert) return applyUpdate
  if (hasDelete) return applyDelete
  if (hasInsert) return applyInsert

  return elementTree => elementTree
}

function applyChanges(
  elementTree: ElementTree,
  descriptors: DescriptorsByComponentType,
  rootElements: { old: Element; new: Element },
  operation: Operation,
): ElementTree {
  // Updates the element tree "cache" based on the provided operation, which can
  // be composed of 1-n component ops. We apply each component op sequentially
  // to the 'old' root element to determine the changed elements and update the
  // cache accordingly at each intermediate step.
  const result = operation.reduce(
    (acc, op) => {
      const rootBefore = acc.rootBefore

      // If there's only one component op, we can skip the application of the op
      // and assume that the result will be the 'new' root element provided to
      // us by the builder.
      const rootAfter = operation.length > 1 ? applyOpComponent(rootBefore, op) : rootElements.new

      const roots = { before: rootBefore, after: rootAfter }
      const applyChange = selectTreeTransform(op)

      return {
        elementTree: applyChange(acc.elementTree, descriptors, roots, op.p),
        rootBefore: rootAfter,
      }
    },
    { elementTree, rootBefore: rootElements.old },
  )

  return result.elementTree
}
