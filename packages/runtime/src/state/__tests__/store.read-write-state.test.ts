import { TestOrigins } from '../../testing/fixtures'
import { configureReadWriteStore } from '../store'

const teardownSpy = jest.fn()
const builderProxyMock = jest.fn(() => ({}))
const createReadWriteMiddlewareMock = jest.fn(() => [])
const setupBuilderProxyMock = jest.fn(() => () => teardownSpy)

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

const createStore = ({
  isReadOnly,
  locale = null,
}: {
  isReadOnly: boolean
  locale?: string | null
}) =>
  configureReadWriteStore({
    name: 'test-store',
    appOrigin: TestOrigins.appOrigin,
    hostApiClient: {
      makeswiftApiClient: {
        dispatch: jest.fn(),
      },
    } as any,
    preloadedState: {
      isReadOnly,
      locale,
    },
  })

describe('read-write store state', () => {
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

  it('calling `loadReadWriteStateIfNeeded` on a read-only store has no effect', async () => {
    const store = createStore({ isReadOnly: true })

    const [unloadA, unloadB] = await Promise.all([
      store.loadReadWriteStateIfNeeded(),
      store.loadReadWriteStateIfNeeded(),
    ])

    unloadA()
    unloadB()

    expect(builderProxyMock).not.toHaveBeenCalled()
    expect(createReadWriteMiddlewareMock).not.toHaveBeenCalled()
    expect(teardownSpy).not.toHaveBeenCalled()
    expect(consoleError).not.toHaveBeenCalled()
  })

  it('read-write state is not unloaded until all providers have unmounted', async () => {
    const store = createStore({ isReadOnly: false })

    const [unloadA, unloadB] = await Promise.all([
      store.loadReadWriteStateIfNeeded(),
      store.loadReadWriteStateIfNeeded(),
    ])

    expect(builderProxyMock).toHaveBeenCalledTimes(1)
    expect(createReadWriteMiddlewareMock).toHaveBeenCalledTimes(1)

    unloadB()

    expect(teardownSpy).not.toHaveBeenCalled()

    unloadA()

    expect(teardownSpy).toHaveBeenCalledTimes(1)
    expect(consoleError).not.toHaveBeenCalled()
  })
})
