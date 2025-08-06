/** @jest-environment jsdom */

import '@testing-library/jest-dom'
import { type Snippet } from '../../../client'

import { createMakeswiftPageSnapshot, testMakeswiftPageHeadRendering } from '../../testing'

import { pageDocument } from './__fixtures__/page-document'

jest.mock('next/head', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <>{children}</>),
}))

jest.mock('next/script', () => ({
  __esModule: true,
  default: jest.fn(({ children, ...props }) => (
    <script {...props} data-nscript="beforeInteractive">
      {children}
    </script>
  )),
}))

const createSnippet = ({ id, code }: { id: string; code: string }): Snippet => ({
  id,
  code,
  location: 'HEAD',
  liveEnabled: true,
  builderEnabled: true,
  cleanup: null,
})

const getPageSnippetTags = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('*[data-makeswift-snippet-id]'))

const renderPageSnapshot = (snapshot: ReturnType<typeof createMakeswiftPageSnapshot>) =>
  testMakeswiftPageHeadRendering({ snapshot }, { forcePagesRouter: true })

describe('Head snippet rendering', () => {
  describe('renders allowed snippet tags', () => {
    test.each([
      '<title>Test Page</title>',
      '<base href="https://www.example.com/" />',
      '<link rel="icon" type="image/x-icon" href="/static/favicon.ico">',
      '<style>body { margin: 0; }</style>',
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      '<script>console.log("Hello World");</script>',
      '<noscript>You need to enable JavaScript to run this app.</noscript>',
      '<template id="template-id"><span>content</span></template>',
    ])('%s', async tag => {
      const snapshot = createMakeswiftPageSnapshot({
        ...pageDocument,
        snippets: [createSnippet({ id: '[test-snippet-1]', code: tag })],
      })

      const render = await renderPageSnapshot(snapshot)
      expect(getPageSnippetTags(render.container)).toMatchSnapshot()
    })
  })

  describe('does not render disallowed snippet tags', () => {
    test.each([
      '<span>hi</span>',
      '<head></head>',
      '<html><body></body></html>',
      '<a href="#">link</a>',
    ])('%s', async tag => {
      const snapshot = createMakeswiftPageSnapshot({
        ...pageDocument,
        snippets: [createSnippet({ id: '[test-snippet-1]', code: tag })],
      })

      const render = await renderPageSnapshot(snapshot)
      expect(getPageSnippetTags(render.container).length).toBe(0)
    })
  })

  test('renders mixed snippet content, skipping disallowed tags', async () => {
    const snapshot = createMakeswiftPageSnapshot({
      ...pageDocument,
      snippets: [
        createSnippet({
          id: '[test-snippet-1]',
          code: [
            '<!-- test snippet 1 begin -->',
            '<meta name="viewport" content="width=device-width, initial-scale=1">',
            '<meta name="snippet 1 before script" content="">',
            '<span>hi</span>',
            '<script>console.log("Snippet 1");</script>',
            '<meta name="snippet 1 after script" content="">',
            '<link rel="icon" type="image/x-icon" href="/static/favicon.ico">',
            '<style>body { margin: 0; }</style>',
            '<a href="#">link</a>',
            '<noscript>You need to enable JavaScript to run this app.</noscript>',
            '<!-- test snippet 1 end -->',
          ].join(''),
        }),
      ],
    })

    const render = await renderPageSnapshot(snapshot)
    expect(getPageSnippetTags(render.container)).toMatchSnapshot()
  })

  test('renders multiple snippets in the order they are defined', async () => {
    const snapshot = createMakeswiftPageSnapshot({
      ...pageDocument,
      snippets: [
        createSnippet({
          id: '[test-snippet-1]',
          code: '<script>console.log("Snippet 1");</script>',
        }),
        createSnippet({
          id: '[test-snippet-2]',
          code: '<script>console.log("Snippet 2");</script>',
        }),
      ],
    })

    const render = await renderPageSnapshot(snapshot)
    expect(getPageSnippetTags(render.container)).toMatchSnapshot()
  })

  test('renders <script> tags using "next/script"', async () => {
    const snapshot = createMakeswiftPageSnapshot({
      ...pageDocument,
      snippets: [
        createSnippet({
          id: '[test-snippet-1]',
          code: '<script>console.log("Snippet 1");</script>',
        }),
      ],
    })

    const render = await renderPageSnapshot(snapshot)
    const tags = getPageSnippetTags(render.container)
    expect(tags.length).toBe(1)
    expect(tags[0].tagName).toBe('SCRIPT')
    expect(tags[0].getAttribute('data-nscript')).toBe('beforeInteractive')
  })
})
