import { configureStore as configureReduxStore } from '@reduxjs/toolkit'

import { ElementImperativeHandle } from '../../runtimes/react/element-imperative-handle'
import { ReactRuntime } from '../../runtimes/react'

import { middlewareOptions } from '../toolkit'

import {
  changeDocument,
  registerComponentHandle,
  registerDocument,
  unregisterDocument,
} from '../actions'
import { propControllerHandlesMiddleware, reducer } from '../react-builder-preview'

import * as ReactPage from '../react-page'

import * as RootElementFixtures from './fixtures/root-elements'
import * as OperationFixtures from './fixtures/operations'
import { buildElementTree } from '../modules/element-trees'

describe('propControllerHandlesMiddleware', () => {
  it('registers prop controllers for element data', () => {
    // Arrange
    const documentKey = 'documentKey'
    const element: ReactPage.Element = { key: 'elementKey', type: 'type', props: {} }
    const store = configureReduxStore({
      reducer,
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware(middlewareOptions).concat(
          ReactPage.elementTreeMiddleware(),
          propControllerHandlesMiddleware(),
        ),
    })

    const setPropControllers = jest.fn()
    const handle = new ElementImperativeHandle()

    handle.callback(() => ({ setPropControllers }))

    store.dispatch(registerDocument(ReactPage.createBaseDocument(documentKey, element, null)))

    // Act
    store.dispatch(registerComponentHandle(documentKey, element.key, handle))

    // Assert
    expect(setPropControllers).toHaveBeenCalled()
  })

  it("doesn't register prop controllers for element references", () => {
    // Arrange
    const documentKey = 'documentKey'
    const element: ReactPage.Element = { type: 'reference', key: 'elementKey', value: 'value' }
    const store = configureReduxStore({
      reducer,
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware(middlewareOptions).concat(propControllerHandlesMiddleware()),
    })

    const setPropControllers = jest.fn()
    const handle = new ElementImperativeHandle()

    handle.callback(() => ({ setPropControllers }))

    store.dispatch(registerDocument(ReactPage.createBaseDocument(documentKey, element, null)))

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
      reducer,
      preloadedState: runtime.store.getState(),
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware(middlewareOptions).concat(ReactPage.elementTreeMiddleware()),
    })

    const getElements = () => ReactPage.getElements(store.getState(), documentKey)
    const getElementIds = () => ReactPage.getElementIds(store.getState(), documentKey)
    const newElementTree = () =>
      buildElementTree(
        ReactPage.getDocument(store.getState(), documentKey)?.rootElement!,
        ReactPage.getPropControllerDescriptors(runtime.store.getState()),
      )

    // Act / Assert
    store.dispatch(
      registerDocument(
        ReactPage.createBaseDocument(documentKey, RootElementFixtures.productOfTheYear, null),
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
        ReactPage.createBaseDocument(documentKey, RootElementFixtures.productOfTheYearFinal, null),
      ),
    )

    expect(getElements()).toStrictEqual(finalElements)
    expect(getElementIds()).toStrictEqual(finalElementIds)
  })
})
