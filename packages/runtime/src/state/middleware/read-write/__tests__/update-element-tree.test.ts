import { configureStore as configureReduxStore } from '@reduxjs/toolkit'

import { createReactRuntime } from '../../../../runtimes/react/testing/react-runtime'

import { middlewareOptions } from '../../../toolkit'
import { changeDocument } from '../../../host-api'
import { registerDocument, unregisterDocument } from '../../../shared-api'
import { createRootReducer } from '../../../read-write-state'
import * as State from '../../../read-only-state'

import { buildElementTree } from '../../../modules/element-trees'

import { readOnlyElementTreeMiddleware } from '../../read-only-element-tree'
import { updateElementTreeMiddleware } from '../update-element-tree'

import * as RootElementFixtures from './fixtures/root-elements'
import * as OperationFixtures from './fixtures/operations'

describe('updateElementTreeMiddleware', () => {
  it('correctly tracks document changes', () => {
    // Arrange
    const documentKey = 'documentKey'
    const runtime = createReactRuntime()
    const store = configureReduxStore({
      reducer: createRootReducer(),
      preloadedState: runtime.protoStore.getState(),
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        State.getDocument(store.getState(), documentKey)?.rootElement!,
        State.getPropControllerDescriptors(runtime.protoStore.getState()),
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
