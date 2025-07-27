import '@testing-library/jest-dom'
import { matchers, createSerializer } from '@emotion/jest'
import { server } from './mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

expect.extend(matchers)
if (typeof window !== 'undefined') {
  // jest-environment jsdom
  expect.addSnapshotSerializer(createSerializer())
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

;(global as any).PACKAGE_VERSION = require('../package.json').version
