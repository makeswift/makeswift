import { type Operation } from 'ot-json0'
import { getIn } from 'immutable'

import { type Element, type ElementData, isElementReference } from '@makeswift/controls'

import { Introspection } from '../../prop-controllers'

import { type Action, ActionTypes } from '../actions'

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

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    case ActionTypes.CREATE_ELEMENT_TREE: {
      const { document, descriptors } = action.payload
      return new Map(state).set(
        document.key,
        buildElementTree(getRootElement(document), descriptors),
      )
    }

    case ActionTypes.DELETE_ELEMENT_TREE: {
      const nextState = new Map(state)
      const deleted = nextState.delete(action.payload.documentKey)
      return deleted ? nextState : state
    }

    case ActionTypes.CHANGE_ELEMENT_TREE: {
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

function hasChildren(
  element: Element,
  propName: string,
  descriptors: DescriptorsByComponentType,
): boolean {
  if (isElementReference(element)) return false

  const propDescriptor = descriptors.get(element.type)?.[propName]
  if (propDescriptor == null) return false

  const children = Introspection.getElementChildren(propDescriptor, element.props[propName])
  return children.length > 0
}

function deleteElement(
  { elements, elementIds }: ElementTree,
  deletedElement: Element,
  propName: string | null,
  descriptors: DescriptorsByComponentType,
) {
  if (propName == null || hasChildren(deletedElement, propName, descriptors)) {
    for (const element of traverseElementTree(deletedElement, descriptors)) {
      elements.delete(element.key)
      elementIds.delete(element.key)
    }
  } else {
    elements.delete(deletedElement.key)
    elementIds.delete(deletedElement.key)
  }
}

function applyDelete(
  elementTree: ElementTree,
  descriptors: DescriptorsByComponentType,
  rootElements: { old: Element; new: Element },
  path: OperationPath,
): ElementTree {
  const [deleteElementPath, ...parentElementPaths] = getChangedElementsPaths(path)
  const [deletedElement, propName] = getElementAndPropName(rootElements.old, deleteElementPath)

  const elements = new Map(elementTree.elements)
  const elementIds = new Map(elementTree.elementIds)

  deleteElement({ elements, elementIds }, deletedElement, propName, descriptors)
  updateParentElements(elements, parentElementPaths, rootElements.new)

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
  if (propName == null || hasChildren(insertedElement, propName, descriptors)) {
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
  rootElements: { old: Element; new: Element },
  path: OperationPath,
): ElementTree {
  const [insertedElementPath, ...parentElementPaths] = getChangedElementsPaths(path)
  const [insertedElement, propName] = getElementAndPropName(rootElements.new, insertedElementPath)

  const elements = new Map(elementTree.elements)
  const elementIds = new Map(elementTree.elementIds)

  insertElement({ elements, elementIds }, insertedElement, propName, descriptors)
  updateParentElements(elements, parentElementPaths, rootElements.new)

  return {
    elements,
    elementIds,
  }
}

function applyUpdate(
  elementTree: ElementTree,
  descriptors: DescriptorsByComponentType,
  rootElements: { old: Element; new: Element },
  path: OperationPath,
): ElementTree {
  const [updateElementPath, ...parentElementPaths] = getChangedElementsPaths(path)
  const [deletedElement, propName] = getElementAndPropName(rootElements.old, updateElementPath)
  const [insertedElement, _] = getElementAndPropName(rootElements.new, updateElementPath)

  const elements = new Map(elementTree.elements)
  const elementIds = new Map(elementTree.elementIds)

  deleteElement({ elements, elementIds }, deletedElement, propName, descriptors)
  insertElement({ elements, elementIds }, insertedElement, propName, descriptors)

  updateParentElements(elements, parentElementPaths, rootElements.new)

  return {
    elements,
    elementIds,
  }
}

function applyChanges(
  elementTree: ElementTree,
  descriptors: DescriptorsByComponentType,
  rootElements: { old: Element; new: Element },
  operation: Operation,
): ElementTree {
  return operation.reduce((tree, op) => {
    const hasDelete = 'ld' in op || 'od' in op
    const hasInsert = 'li' in op || 'oi' in op
    if (hasDelete && hasInsert) {
      return applyUpdate(tree, descriptors, rootElements, op.p)
    }

    if (hasDelete) return applyDelete(tree, descriptors, rootElements, op.p)
    if (hasInsert) return applyInsert(tree, descriptors, rootElements, op.p)
    return tree
  }, elementTree)
}
