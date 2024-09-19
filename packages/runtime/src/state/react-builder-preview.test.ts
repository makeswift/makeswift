import { registerComponentHandle, registerDocument } from './actions'
import { ElementImperativeHandle } from '../runtimes/react/element-imperative-handle'
import { applyMiddleware, createStore } from 'redux'
import { propControllerHandlesMiddleware, reducer } from './react-builder-preview'
import thunk from 'redux-thunk'
import * as ReactPage from './react-page'

describe('propControllerHandlesMiddleware', () => {
  it('registers prop controllers for element data', () => {
    // Arrange
    const documentKey = 'documentKey'
    const element: ReactPage.Element = { key: 'elementKey', type: 'type', props: {} }
    const store = createStore(reducer, applyMiddleware(thunk, propControllerHandlesMiddleware()))
    const setPropControllers = jest.fn()
    const handle = new ElementImperativeHandle()

    handle.callback(() => ({ setPropControllers }))

    store.dispatch(registerDocument(ReactPage.createDocument(documentKey, element, null)))

    // Act
    store.dispatch(registerComponentHandle(documentKey, element.key, handle))

    // Assert
    expect(setPropControllers).toHaveBeenCalled()
  })

  it("doesn't register prop controllers for element references", () => {
    // Arrange
    const documentKey = 'documentKey'
    const element: ReactPage.Element = { type: 'reference', key: 'elementKey', value: 'value' }
    const store = createStore(reducer, applyMiddleware(thunk, propControllerHandlesMiddleware()))
    const setPropControllers = jest.fn()
    const handle = new ElementImperativeHandle()

    handle.callback(() => ({ setPropControllers }))

    store.dispatch(registerDocument(ReactPage.createDocument(documentKey, element, null)))

    // Act
    store.dispatch(registerComponentHandle(documentKey, element.key, handle))

    // Assert
    expect(setPropControllers).not.toHaveBeenCalled()
  })
})
