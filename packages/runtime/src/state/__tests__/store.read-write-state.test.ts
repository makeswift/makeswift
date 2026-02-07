import { TestOrigins } from '../../testing/fixtures'
import { configureStore } from '../store'

const teardownSpy = jest.fn()
const builderProxyMock = jest.fn(() => ({ teardown: teardownSpy }))
const createReadWriteMiddlewareMock = jest.fn(() => [])
const setupBuilderProxyMock = jest.fn(() => ({ type: 'test/setup-builder-proxy' }))
const createRootReducerMock = jest.fn(
  () =>
    (state = {}) =>
      state,
)

jest.mock('../builder-api/proxy', () => ({
  BuilderAPIProxy: builderProxyMock,
}))

jest.mock('../middleware/read-write', () => ({
  createReadWriteMiddleware: createReadWriteMiddlewareMock,
}))

jest.mock('../read-write-state', () => ({
  createRootReducer: createRootReducerMock,
  setupBuilderProxy: setupBuilderProxyMock,
}))

const createStore = () =>
  configureStore({
    name: 'test-store',
    appOrigin: TestOrigins.appOrigin,
    hostApiClient: {
      makeswiftApiClient: {
        dispatch: jest.fn(),
      },
    } as any,
    preloadedState: null,
  })

describe('loadReadWriteState', () => {
  let consoleError: jest.SpyInstance
  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(jest.fn())
  })

  afterEach(() => {
    consoleError.mockRestore()
  })

  beforeEach(() => {
    teardownSpy.mockClear()
    builderProxyMock.mockClear()
    createReadWriteMiddlewareMock.mockClear()
    setupBuilderProxyMock.mockClear()
    createRootReducerMock.mockClear()
  })

  it('calling `loadReadWriteState` with isReadOnly=true has no effect', async () => {
    const store = createStore()

    const [unloadA, unloadB] = await Promise.all([
      store.loadReadWriteState({ isReadOnly: true }),
      store.loadReadWriteState({ isReadOnly: true }),
    ])

    unloadA()
    unloadB()

    expect(builderProxyMock).not.toHaveBeenCalled()
    expect(createReadWriteMiddlewareMock).not.toHaveBeenCalled()
    expect(teardownSpy).not.toHaveBeenCalled()
    expect(consoleError).not.toHaveBeenCalled()
  })

  it('cleanly switches from read-only to read=write state', async () => {
    const store = createStore()

    const unloadA = await store.loadReadWriteState({ isReadOnly: true })
    unloadA()

    const unloadB = await store.loadReadWriteState({ isReadOnly: false })

    expect(builderProxyMock).toHaveBeenCalledTimes(1)
    expect(createReadWriteMiddlewareMock).toHaveBeenCalledTimes(1)
    expect(teardownSpy).not.toHaveBeenCalled()

    unloadB()
    expect(teardownSpy).toHaveBeenCalledTimes(1)
    expect(consoleError).not.toHaveBeenCalled()
  })

  it('read-write state is not unloaded until all providers have unmounted', async () => {
    const store = createStore()

    const [unloadA, unloadB] = await Promise.all([
      store.loadReadWriteState({ isReadOnly: false }),
      store.loadReadWriteState({ isReadOnly: false }),
    ])

    expect(builderProxyMock).toHaveBeenCalledTimes(1)
    expect(createReadWriteMiddlewareMock).toHaveBeenCalledTimes(1)

    unloadB()

    expect(teardownSpy).not.toHaveBeenCalled()

    unloadA()

    expect(teardownSpy).toHaveBeenCalledTimes(1)
    expect(consoleError).not.toHaveBeenCalled()
  })

  it('read-write state inconsistencies are detected and logged', async () => {
    const store = createStore()

    const unloadA = await store.loadReadWriteState({ isReadOnly: false })
    const unloadB = await store.loadReadWriteState({ isReadOnly: true })

    expect(consoleError).toHaveBeenCalledWith('Read-write state mismatch', {
      isReadOnly: true,
      refCount: 1,
    })

    unloadA()
    unloadB()
  })
})
