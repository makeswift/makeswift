import '@testing-library/jest-dom'
import { server } from './mocks/server'
import { createMakeswiftStylesSnapshotSerializer } from './testing/jest-snapshot-serializer'

beforeAll(() => server.listen())
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

  /*
    https://github.com/jsdom/jsdom/issues/3998
  */
  if (!document.adoptedStyleSheets) {
    Object.defineProperty(document, 'adoptedStyleSheets', {
      writable: true,
      configurable: true,
      value: [],
    })
  }

  /*
    Handling the missing implementation for `replaceSync` on `CSSStyleSheet`,
    which is needed by the css runtime.
    
    https://github.com/jsdom/jsdom/issues/3766 (fixed in later jsdom).
  */
  window.CSSStyleSheet.prototype.replace = async function (cssText) {
    if (typeof document === 'undefined' || document == null) {
      return this
    }

    /*
      A workaround to go from the inputted string containing CSS statements to a
      CSSRule array: we create a style element using the inputted string, append it to
      the document to force the creation of a CSSStyleSheet (accessed via `tempStyle.sheet`),
      then access that CSSStyleSheet's CSSRule array. This gives us the format we need to be
      able to call `this.insertRule`.
    */
    const tempStyle = document.createElement('style')
    tempStyle.textContent = cssText
    document.head.appendChild(tempStyle)
    const parsedRules = tempStyle.sheet ? Array.from(tempStyle.sheet?.cssRules) : []
    document.head.removeChild(tempStyle)

    while (this.cssRules.length > 0) {
      this.deleteRule(0)
    }
    parsedRules.reverse().forEach(rule => {
      this.insertRule(rule.cssText, 0)
    })

    return this
  }
  window.CSSStyleSheet.prototype.replaceSync = function (cssText) {
    return Promise.resolve(this.replace(cssText))
  }
}

;(global as any).PACKAGE_VERSION = require('../package.json').version
