import { configureStore as configureReduxStore } from '@reduxjs/toolkit'

import { ElementImperativeHandle } from '../../runtimes/react/element-imperative-handle'
import { ReactRuntime } from '../../runtimes/react'

import { middlewareOptions } from '../toolkit'

import { registerDocument, unregisterDocument } from '../shared-api'
import { changeDocument } from '../host-api'
import { registerComponentHandle } from '../actions/internal/read-only-actions'

import { createRootReducer } from '../read-write-state'
import { propControllerHandlesMiddleware } from '../middleware/prop-controller-handles'
import { readOnlyElementTreeMiddleware } from '../middleware/read-only-element-tree'
import { updateElementTreeMiddleware } from '../middleware/read-write/update-element-tree'

import * as State from '../read-only-state'

import * as RootElementFixtures from './fixtures/root-elements'
import * as OperationFixtures from './fixtures/operations'
import { buildElementTree } from '../modules/element-trees'

describe('propControllerHandlesMiddleware', () => {
  it('registers prop controllers for element data', () => {
    // Arrange
    const documentKey = 'documentKey'
    const element: State.Element = { key: 'elementKey', type: 'type', props: {} }
    const store = configureReduxStore({
      reducer: createRootReducer(),
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware(middlewareOptions).concat(
          readOnlyElementTreeMiddleware(),
          updateElementTreeMiddleware(),
          propControllerHandlesMiddleware(),
        ),
    })

    const setPropControllers = jest.fn()
    const handle = new ElementImperativeHandle()

    handle.callback(() => ({ setPropControllers }))

    store.dispatch(registerDocument(State.createBaseDocument(documentKey, element, null)))

    // Act
    store.dispatch(registerComponentHandle(documentKey, element.key, handle))

    // Assert
    expect(setPropControllers).toHaveBeenCalled()
  })

  it("doesn't register prop controllers for element references", () => {
    // Arrange
    const documentKey = 'documentKey'
    const element: State.Element = { type: 'reference', key: 'elementKey', value: 'value' }
    const store = configureReduxStore({
      reducer: createRootReducer(),
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware(middlewareOptions).concat(propControllerHandlesMiddleware()),
    })

    const setPropControllers = jest.fn()
    const handle = new ElementImperativeHandle()

    handle.callback(() => ({ setPropControllers }))

    store.dispatch(registerDocument(State.createBaseDocument(documentKey, element, null)))

    // Act
    store.dispatch(registerComponentHandle(documentKey, element.key, handle))

    // Assert
    expect(setPropControllers).not.toHaveBeenCalled()
  })
})

describe('elementTreeMiddleware', () => {
  it('correctly tracks document changes', () => {
    // Arrange
    const documentKey = 'documentKey'
    const runtime = new ReactRuntime()
    const store = configureReduxStore({
      reducer: createRootReducer(),
      preloadedState: runtime.store.getState(),
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware(middlewareOptions).concat(
          readOnlyElementTreeMiddleware(),
          updateElementTreeMiddleware(),
        ),
    })

    const getElements = () => State.getElements(store.getState(), documentKey)
    const getElementIds = () => State.getElementIds(store.getState(), documentKey)
    const newElementTree = () =>
      buildElementTree(
        State.getDocument(store.getState(), documentKey)?.rootElement!,
        State.getPropControllerDescriptors(runtime.store.getState()),
      )

    // Act / Assert
    store.dispatch(
      registerDocument(
        State.createBaseDocument(documentKey, RootElementFixtures.productOfTheYear, null),
      ),
    )
    expect(getElements()).toMatchSnapshot('initial elements')
    expect(getElementIds()).toMatchSnapshot('initial element ids')

    store.dispatch(changeDocument(documentKey, OperationFixtures.changeButtonTitle))
    expect(getElements()).toStrictEqual(newElementTree().elements)

    store.dispatch(changeDocument(documentKey, OperationFixtures.changePageBackground))
    expect(getElements()).toStrictEqual(newElementTree().elements)

    store.dispatch(changeDocument(documentKey, OperationFixtures.insertBanner))
    expect(getElements()).toStrictEqual(newElementTree().elements)

    store.dispatch(changeDocument(documentKey, OperationFixtures.editTagline))
    expect(getElements()).toStrictEqual(newElementTree().elements)

    store.dispatch(changeDocument(documentKey, OperationFixtures.updateElementId))
    expect(getElements()).toStrictEqual(newElementTree().elements)
    expect(getElementIds()).toStrictEqual(newElementTree().elementIds)

    store.dispatch(changeDocument(documentKey, OperationFixtures.addElementId))
    const finalElements = getElements()
    const finalElementIds = getElementIds()

    expect(finalElements).toStrictEqual(newElementTree().elements)
    expect(finalElementIds).toStrictEqual(newElementTree().elementIds)

    expect(finalElements).toMatchSnapshot('final elements')
    expect(finalElementIds).toMatchSnapshot('final element ids')

    store.dispatch(unregisterDocument(documentKey))
    store.dispatch(
      registerDocument(
        State.createBaseDocument(documentKey, RootElementFixtures.productOfTheYearFinal, null),
      ),
    )

    expect(getElements()).toStrictEqual(finalElements)
    expect(getElementIds()).toStrictEqual(finalElementIds)
  })
})
