import { configureStore as configureReduxStore } from '@reduxjs/toolkit'

import { ElementImperativeHandle } from '../../../../runtimes/react/element-imperative-handle'

import {
  registerComponentHandle,
  unregisterComponentHandle,
} from '../../../actions/internal/read-write-actions'
import { middlewareOptions } from '../../../toolkit'
import { registerDocument } from '../../../shared-api'
import { createRootReducer, getPropControllersHandle } from '../../../read-write-state'
import * as State from '../../../read-only-state'

import { readOnlyElementTreeMiddleware } from '../../read-only-element-tree'

import { propControllerHandlesMiddleware } from '../prop-controller-handles'

describe('propControllerHandlesMiddleware', () => {
  const createFixtures = () => {
    const store = configureReduxStore({
      reducer: createRootReducer(),
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware(middlewareOptions).concat(
          readOnlyElementTreeMiddleware(),
          propControllerHandlesMiddleware(),
        ),
    })

    const documentKey = 'documentKey'
    const handle = new ElementImperativeHandle()

    return { store, documentKey, handle }
  }

  it('registers and unregisters prop controllers for element data', () => {
    // Arrange
    const { store, documentKey, handle } = createFixtures()
    const element: State.Element = { key: 'elementKey', type: 'type', props: {} }

    store.dispatch(registerDocument(State.createBaseDocument(documentKey, element, null)))

    const setPropControllers = jest.fn()
    handle.callback(() => ({ setPropControllers }))

    // Register and assert
    expect(
      getPropControllersHandle(store.getState(), { documentKey, elementKey: element.key }),
    ).toBe(null)

    store.dispatch(registerComponentHandle(documentKey, element.key, handle))
    expect(
      getPropControllersHandle(store.getState(), { documentKey, elementKey: element.key }),
    ).toBe(handle)

    expect(setPropControllers).toHaveBeenCalled()

    // Unregister and assert
    store.dispatch(unregisterComponentHandle(documentKey, element.key))
    expect(
      getPropControllersHandle(store.getState(), { documentKey, elementKey: element.key }),
    ).toBe(null)
  })

  it("doesn't register prop controllers for element references", () => {
    // Arrange
    const { store, documentKey, handle } = createFixtures()
    const element: State.Element = { type: 'reference', key: 'elementKey', value: 'value' }

    const setPropControllers = jest.fn()
    handle.callback(() => ({ setPropControllers }))

    store.dispatch(registerDocument(State.createBaseDocument(documentKey, element, null)))

    // Act and assert
    expect(
      getPropControllersHandle(store.getState(), { documentKey, elementKey: element.key }),
    ).toBe(null)

    store.dispatch(registerComponentHandle(documentKey, element.key, handle))
    expect(
      getPropControllersHandle(store.getState(), { documentKey, elementKey: element.key }),
    ).toBe(null)

    expect(setPropControllers).not.toHaveBeenCalled()
  })
})
