import '@testing-library/jest-dom'
import { server } from './mocks/server'
import { createMakeswiftStylesSnapshotSerializer } from './testing/jest-snapshot-serializer'

beforeAll(() => server.listen())
beforeEach(() => {
  if (typeof document !== 'undefined') {
    clearDocumentCachedHoistedResources()
    clearDocumentStyleElements()
  }
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

if (typeof window !== 'undefined') {
  // jest-environment jsdom
  expect.addSnapshotSerializer(createMakeswiftStylesSnapshotSerializer())
}

let uidSuffix = 100000000000
jest.mock('uuid', () => ({
  v4: jest.fn(() => `xxxxxxxx-xxxx-xxxx-xxxx-${uidSuffix++}`),
  v5: jest.fn(() => `xxxxxxxx-xxxx-xxxx-xxxx-${uidSuffix++}`),
}))

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    })),
  })
}

/**
 * React caches hoisted resources (i.e. `<style>` elements) on the document at a
 * property named `__reactResources$<someKey>`. If we don't remove them before each
 * test, then their presence can prevent the hoisting of a new `<style>` element if
 * it has the same `href` as the cached resource.
 *
 * See `__react` keys in: `react/packages/react-dom-bindings/src/client/ReactDOMComponentTree.js`
 */
function clearDocumentCachedHoistedResources() {
  for (const key of Object.getOwnPropertyNames(document)) {
    if (key.startsWith('__reactResources$')) {
      delete (document as unknown as Record<string, unknown>)[key]
    }
  }
}

function clearDocumentStyleElements() {
  const styleElements = document.querySelectorAll<HTMLStyleElement>('style')
  for (const styleElement of styleElements) {
    styleElement.remove()
  }
}

;(global as any).PACKAGE_VERSION = require('../package.json').version
