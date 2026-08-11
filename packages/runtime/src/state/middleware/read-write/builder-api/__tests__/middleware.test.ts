/** @jest-environment jsdom */
import { configureStore as configureReduxStore } from '@reduxjs/toolkit'

import { middlewareOptions } from '../../../../toolkit'
import { createRootReducer } from '../../../../read-write-state'
import { handleWheel, mountComponent, unmountComponent } from '../../../../builder-api/actions'
import { type BuilderAPIProxy } from '../../../../builder-api/proxy'

import { builderAPIMiddleware } from '../middleware'

describe('builderAPIMiddleware', () => {
  const mockExecute = jest.fn()
  const builderProxy = { execute: mockExecute } as unknown as BuilderAPIProxy

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createStore = () =>
    configureReduxStore({
      reducer: createRootReducer(),
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware(middlewareOptions).concat(builderAPIMiddleware(builderProxy)),
    })

  describe('handling builder actions', () => {
    it('immediately executes non mount change actions', () => {
      const store = createStore()
      const action = handleWheel({ deltaX: 1, deltaY: 2 })

      store.dispatch(action)

      expect(mockExecute).toHaveBeenCalledWith(action)
    })

    it('executes mount component actions after the current task completes', async () => {
      const store = createStore()
      const action = mountComponent('documentKey', 'elementKey')

      store.dispatch(action)

      expect(mockExecute).not.toHaveBeenCalled()

      await Promise.resolve()

      expect(mockExecute).toHaveBeenCalledWith(action)
    })

    it('executes unmount component actions after the current task completes', async () => {
      const store = createStore()
      const action = unmountComponent('documentKey', 'elementKey')

      store.dispatch(action)

      expect(mockExecute).not.toHaveBeenCalled()

      await Promise.resolve()

      expect(mockExecute).toHaveBeenCalledWith(action)
    })
  })
})
