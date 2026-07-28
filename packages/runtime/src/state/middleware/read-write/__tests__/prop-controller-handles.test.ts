import { configureStore as configureReduxStore } from '@reduxjs/toolkit'

import { ElementImperativeHandle } from '../../../../runtimes/react/element-imperative-handle'

import { registerComponentHandle } from '../../../actions/internal/read-write-actions'
import { middlewareOptions } from '../../../toolkit'
import { registerDocument } from '../../../shared-api'
import { createRootReducer } from '../../../read-write-state'
import * as State from '../../../read-only-state'

import { readOnlyElementTreeMiddleware } from '../../read-only-element-tree'

import { propControllerHandlesMiddleware } from '../prop-controller-handles'

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
