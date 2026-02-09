/** @jest-environment jsdom */
import { render, waitFor } from '@testing-library/react'

import { useAsyncEffect } from '../use-async-effect'
import { createDeferred } from '../../../../utils/deferred'

describe('useAsyncEffect', () => {
  let consoleError: jest.SpyInstance
  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(jest.fn())
  })

  afterEach(() => {
    consoleError.mockRestore()
  })

  it('runs cleanup on unmount after effect resolves', async () => {
    // Arrange
    const cleanup = jest.fn()
    const effect = jest.fn(async () => cleanup)

    function Component() {
      useAsyncEffect(effect, [])
      return null
    }

    const { unmount } = render(<Component />)

    // Act
    await waitFor(() => expect(effect).toHaveBeenCalledTimes(1))
    unmount()

    // Assert
    expect(cleanup).toHaveBeenCalledTimes(1)
  })

  it('runs cleanup when unmounted before effect resolves', async () => {
    // Arrange
    const cleanup = jest.fn()
    const deferred = createDeferred<void | (() => void)>()
    const effect = jest.fn(() => deferred.promise)

    const Component = () => {
      useAsyncEffect(effect, [])
      return null
    }

    const { unmount } = render(<Component />)

    // Act
    unmount()
    deferred.resolve(cleanup)

    // Assert
    await waitFor(() => expect(cleanup).toHaveBeenCalledTimes(1))
  })

  it('runs cleanup when dependencies change', async () => {
    // Arrange
    const cleanupA = jest.fn()
    const cleanupB = jest.fn()
    const effect = jest
      .fn<Promise<void | (() => void)>, [number]>()
      .mockResolvedValueOnce(cleanupA)
      .mockResolvedValueOnce(cleanupB)

    const Component = ({ value }: { value: number }) => {
      useAsyncEffect(() => effect(value), [value])
      return null
    }

    const { rerender, unmount } = render(<Component value={1} />)

    // Act
    await waitFor(() => expect(effect).toHaveBeenCalledTimes(1))
    rerender(<Component value={2} />)

    // Assert
    await waitFor(() => expect(effect).toHaveBeenCalledTimes(2))
    expect(cleanupA).toHaveBeenCalledTimes(1)
    expect(cleanupB).not.toHaveBeenCalled()

    // Act
    unmount()

    // Assert
    expect(cleanupB).toHaveBeenCalledTimes(1)
  })

  it("doesn't run cleanup if the effect throws, logs error to the console", async () => {
    // Arrange
    const cleanup = jest.fn()
    const deferred = createDeferred<void | (() => void)>()
    const effect = jest.fn(() => deferred.promise)

    const Component = () => {
      useAsyncEffect(effect, [])
      return null
    }

    const { unmount } = render(<Component />)

    // Act
    unmount()
    deferred.reject('Effect failed')

    // Assert
    await waitFor(() => deferred.promise.catch(() => {}))
    expect(cleanup).not.toHaveBeenCalled()
    expect(consoleError).toHaveBeenCalledWith('Async effect error:', {
      error: 'Effect failed',
      deps: [],
    })
  })

  it('logs cleanup errors', async () => {
    // Arrange
    const cleanupError = new Error('Cleanup failed')
    const effect = jest.fn(async () => () => {
      throw cleanupError
    })

    const Component = () => {
      useAsyncEffect(effect, [])
      return null
    }

    const { unmount } = render(<Component />)

    // Act
    await waitFor(() => expect(effect).toHaveBeenCalledTimes(1))
    unmount()

    // Assert
    expect(consoleError).toHaveBeenCalledWith('Async effect cleanup error:', {
      error: cleanupError,
      deps: [],
    })
  })
})
