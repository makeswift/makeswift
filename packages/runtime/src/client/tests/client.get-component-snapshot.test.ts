import {
  MakeswiftClient,
  MakeswiftComponentDocument,
  MakeswiftComponentDocumentFallback,
} from '../../client'
import { http, HttpResponse, graphql } from 'msw'

import { createReactRuntime } from '../../runtimes/react/testing/react-runtime'

import { server } from '../../mocks/server'
import { makePagePathnameSlice, TestWorkingSiteVersion } from '../../testing/fixtures'
import { Link } from '../../controls'

const TEST_API_KEY = 'myApiKey'
const runtime = createReactRuntime()
const baseUrl = `${runtime.apiOrigin}/v1/content/element-trees`

function createTestClient() {
  return new MakeswiftClient(TEST_API_KEY, { runtime })
}

function makeDocument(
  id: string,
  locale: string | null,
  { key = 'abc123' }: { key?: string } = {},
): MakeswiftComponentDocument {
  return {
    id,
    name: 'myElementTree',
    data: {
      type: 'myType',
      key,
      props: {},
    },
    locale,
    siteId: 'mySiteId',
    inheritsFromParent: false,
  }
}

function makeEmptyDocument(id: string, locale: string | null): MakeswiftComponentDocumentFallback {
  return { id, locale, data: null }
}

afterEach(() => {
  jest.resetAllMocks()
})

describe('getComponentSnapshot using the element tree content endpoint', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  test('returns null document data on a 200 empty document response', async () => {
    // Arrange
    const client = createTestClient()
    const treeId = 'myTree'
    const httpHandler = jest.fn((_: { request: Request }) =>
      HttpResponse.json(makeEmptyDocument(treeId, null), { status: 200 }),
    )
    server.use(http.get(`${baseUrl}/${treeId}`, httpHandler))

    // Act
    const result = await client.getComponentSnapshot(treeId, {
      siteVersion: TestWorkingSiteVersion,
    })

    // Assert
    expect(result.document.id).toBe(treeId)
    expect(result.document.data).toBeNull()
    expect(result.document.locale).toBeNull()
    expect(result.meta).toEqual({ allowLocaleFallback: true, requestedLocale: null })

    expect(httpHandler).toHaveBeenCalledTimes(1)
    const { searchParams } = new URL(httpHandler.mock.calls[0][0].request.url)
    expect(searchParams.has('locale')).toBe(false)
  })

  test('preserves the requested locale on an empty document response', async () => {
    // Arrange
    const client = createTestClient()
    const treeId = 'myTree'
    const localeToTest = 'fr-FR'
    server.use(
      http.get(
        `${baseUrl}/${treeId}`,
        () => HttpResponse.json(makeEmptyDocument(treeId, localeToTest), { status: 200 }),
        { once: true },
      ),
    )

    // Act
    const result = await client.getComponentSnapshot(treeId, {
      siteVersion: TestWorkingSiteVersion,
      locale: localeToTest,
    })

    // Assert
    expect(result.document.data).toBeNull()
    expect(result.document.locale).toBe(localeToTest)
    expect(result.meta.requestedLocale).toBe(localeToTest)
  })

  test('throws on a 404 response', async () => {
    // Arrange
    const client = createTestClient()
    const treeId = 'myTree'
    server.use(
      http.get(`${baseUrl}/${treeId}`, () => HttpResponse.text('', { status: 404 }), {
        once: true,
      }),
    )

    // Act
    const resultPromise = client.getComponentSnapshot(treeId, {
      siteVersion: TestWorkingSiteVersion,
    })

    // Assert
    await expect(resultPromise).rejects.toThrow(
      "Failed to get component snapshot for 'myTree': 404 Not Found",
    )
  })

  test('throws on a 400 response', async () => {
    // Arrange
    const client = createTestClient()
    const treeId = 'myTree'
    server.use(
      http.get(`${baseUrl}/${treeId}`, () => HttpResponse.text('', { status: 400 }), {
        once: true,
      }),
    )

    // Act
    const resultPromise = client.getComponentSnapshot(treeId, {
      siteVersion: TestWorkingSiteVersion,
    })

    // Assert
    await expect(resultPromise).rejects.toThrow(
      "Failed to get component snapshot for 'myTree': 400 Bad Request",
    )
  })

  test.each([
    { treeId: 'myTree123', locale: 'fr-FR' },
    { treeId: 'unsafe:url;chars=@&?❔🤷', locale: 'fr-FR' },
    { treeId: '/blog/slug', locale: 'en-US' },
  ])(
    "uses the base locale tree returned by the server for the element tree '$treeId' with the '$locale' locale",
    async ({ treeId, locale }) => {
      // Arrange
      const client = createTestClient()
      const elementTreeKey = 'abc123'
      const document = makeDocument(treeId, null, { key: elementTreeKey })

      const httpHandler = jest.fn((_: { request: Request }) =>
        HttpResponse.json(document, { status: 200 }),
      )

      server.use(
        http.get(`${baseUrl}/${encodeURIComponent(treeId)}`, httpHandler),
        graphql.operation(() => HttpResponse.json({})),
      )

      // Act
      const result = await client.getComponentSnapshot(treeId, {
        siteVersion: TestWorkingSiteVersion,
        locale,
      })

      // Assert
      expect(result.document.id).toBe(treeId)
      expect(result.document.data?.key).toBe(elementTreeKey)
      expect(result.document.locale).toBeNull()
      expect(result.meta.requestedLocale).toBe(locale)

      expect(httpHandler).toHaveBeenCalledTimes(1)
      const { searchParams } = new URL(httpHandler.mock.calls[0][0].request.url)
      expect(searchParams.get('locale')).toBe(locale)
    },
  )

  test('returns null document data when allowLocaleFallback is false and the server fell back to the base locale tree', async () => {
    // Arrange
    const client = createTestClient()
    const treeId = 'myTree123'
    const localeToTest = 'fr-FR'

    const httpHandler = jest.fn((_: { request: Request }) =>
      HttpResponse.json(makeDocument(treeId, null), { status: 200 }),
    )
    server.use(http.get(`${baseUrl}/${encodeURIComponent(treeId)}`, httpHandler))

    // Act
    const result = await client.getComponentSnapshot(treeId, {
      siteVersion: TestWorkingSiteVersion,
      locale: localeToTest,
      allowLocaleFallback: false,
    })

    // Assert
    expect(result.document.id).toBe(treeId)
    expect(result.document.data).toBeNull()
    expect(result.document.locale).toBe(localeToTest)
    expect(result.meta).toEqual({ allowLocaleFallback: false, requestedLocale: localeToTest })
    expect(result.cacheData.apiResources.PagePathnameSlice ?? []).toEqual([])

    expect(httpHandler).toHaveBeenCalledTimes(1)
    const { searchParams } = new URL(httpHandler.mock.calls[0][0].request.url)
    expect(searchParams.get('locale')).toBe(localeToTest)
  })

  test('returns the localized element tree when allowLocaleFallback is false and it exists', async () => {
    // Arrange
    const client = createTestClient()
    const treeId = 'myTree123'
    const localeToTest = 'fr-FR'
    const document = makeDocument(treeId, localeToTest)

    server.use(
      http.get(`${baseUrl}/${encodeURIComponent(treeId)}`, () =>
        HttpResponse.json(document, { status: 200 }),
      ),
      graphql.operation(() => HttpResponse.json({})),
    )

    // Act
    const result = await client.getComponentSnapshot(treeId, {
      siteVersion: TestWorkingSiteVersion,
      locale: localeToTest,
      allowLocaleFallback: false,
    })

    // Assert
    expect(result.document.data).not.toBeNull()
    expect(result.document.locale).toBe(localeToTest)
  })

  test('preserves an empty document when allowLocaleFallback is false', async () => {
    // Arrange
    const client = createTestClient()
    const treeId = 'myTree123'
    const localeToTest = 'fr-FR'

    server.use(
      http.get(`${baseUrl}/${encodeURIComponent(treeId)}`, () =>
        HttpResponse.json(makeEmptyDocument(treeId, localeToTest), { status: 200 }),
      ),
    )

    // Act
    const result = await client.getComponentSnapshot(treeId, {
      siteVersion: TestWorkingSiteVersion,
      locale: localeToTest,
      allowLocaleFallback: false,
    })

    // Assert
    expect(result.document.data).toBeNull()
    expect(result.document.locale).toBe(localeToTest)
  })

  test('omits the locale param when the base locale is requested', async () => {
    // Arrange
    const client = createTestClient()
    const treeId = 'myTree123'
    const httpHandler = jest.fn((_: { request: Request }) =>
      HttpResponse.json(makeDocument(treeId, null), { status: 200 }),
    )
    server.use(
      http.get(`${baseUrl}/${encodeURIComponent(treeId)}`, httpHandler),
      graphql.operation(() => HttpResponse.json({})),
    )

    // Act
    const result = await client.getComponentSnapshot(treeId, {
      siteVersion: TestWorkingSiteVersion,
    })

    // Assert
    expect(result.document.data).not.toBeNull()
    expect(result.document.locale).toBeNull()

    expect(httpHandler).toHaveBeenCalledTimes(1)
    const { searchParams } = new URL(httpHandler.mock.calls[0][0].request.url)
    expect(searchParams.has('locale')).toBe(false)
  })

  test.each([
    { treeId: 'myTree123', locale: 'fr-FR' },
    { treeId: 'unsafe:url;chars=@&?❔🤷', locale: 'fr-FR' },
    { treeId: '/blog/slug', locale: 'en-US' },
  ])(
    "returns the localized element tree '$treeId' with the requested locale '$locale'",
    async ({ treeId, locale }) => {
      // Arrange
      const client = createTestClient()
      const document = makeDocument(treeId, locale)
      const httpHandler = jest.fn((_: { request: Request }) =>
        HttpResponse.json(document, { status: 200 }),
      )

      server.use(
        http.get(`${baseUrl}/${encodeURIComponent(treeId)}`, httpHandler),
        graphql.operation(() => HttpResponse.json({})),
      )

      // Act
      const result = await client.getComponentSnapshot(treeId, {
        siteVersion: TestWorkingSiteVersion,
        locale,
      })

      // Assert
      expect(result.document.id).toBe(treeId)
      expect(result.document.locale).toBe(locale)
      expect(result.document.data).not.toBeNull()

      expect(httpHandler).toHaveBeenCalledTimes(1)
      const { searchParams } = new URL(httpHandler.mock.calls[0][0].request.url)
      expect(searchParams.get('locale')).toBe(locale)
    },
  )

  describe('introspects the element tree using the result locale, not the requested locale', () => {
    const PAGE_ID = 'page-a'
    const TEST_LINK_COMPONENT_TYPE = 'test-link-component'

    beforeAll(() => {
      runtime.registerComponent(() => null, {
        type: TEST_LINK_COMPONENT_TYPE,
        label: 'Test Component',
        props: {
          link: Link({ label: 'Link' }),
        },
      })
    })

    function makeSlicesHandler() {
      return jest.fn(({ request }: { request: Request }) => {
        const ids = new URL(request.url).searchParams.getAll('ids')
        return HttpResponse.json(ids.map(id => makePagePathnameSlice(id)))
      })
    }

    function makeLinkDocument(id: string, locale: string | null): MakeswiftComponentDocument {
      return {
        id,
        name: 'Site Header',
        data: {
          type: TEST_LINK_COMPONENT_TYPE,
          key: `${id}-key`,
          props: { link: { type: 'OPEN_PAGE', payload: { pageId: PAGE_ID, openInNewTab: false } } },
        },
        locale,
        siteId: '0000-0000',
        inheritsFromParent: false,
      }
    }

    test('uses the default locale (null) when the server fell back to the base tree', async () => {
      // Arrange
      const client = createTestClient()
      const elementTreeId = 'site-header-123'
      const requestedLocale = 'fr-FR'

      const treeHandler = jest.fn(() =>
        HttpResponse.json(makeLinkDocument(elementTreeId, null), { status: 200 }),
      )
      const slicesHandler = makeSlicesHandler()

      server.use(
        http.get(`${baseUrl}/${encodeURIComponent(elementTreeId)}`, treeHandler),
        http.get(`${runtime.apiOrigin}/v3/page-pathname-slices/bulk`, slicesHandler),
        graphql.operation(() => HttpResponse.json({})),
      )

      // Act
      const result = await client.getComponentSnapshot(elementTreeId, {
        siteVersion: TestWorkingSiteVersion,
        locale: requestedLocale,
      })

      // Assert
      expect(result.document.locale).toBeNull()
      expect(treeHandler).toHaveBeenCalledTimes(1)

      // Confirm introspection ran with that result locale (null), not 'fr-FR'.
      expect(result.cacheData.apiResources.PagePathnameSlice).toEqual([
        {
          id: PAGE_ID,
          value: makePagePathnameSlice(PAGE_ID, { localizedPathname: null }),
          locale: null,
        },
      ])

      expect(slicesHandler).toHaveBeenCalledTimes(1)
      expect(slicesHandler.mock.calls[0][0].request.url).not.toContain('locale=')
    })

    test('uses the requested locale when the localized tree exists', async () => {
      // Arrange
      const client = createTestClient()
      const elementTreeId = 'site-header-123'
      const requestedLocale = 'fr-FR'
      const document = makeLinkDocument(elementTreeId, requestedLocale)

      const slicesHandler = makeSlicesHandler()
      server.use(
        http.get(`${baseUrl}/${encodeURIComponent(elementTreeId)}`, () =>
          HttpResponse.json(document, { status: 200 }),
        ),
        http.get(`${runtime.apiOrigin}/v3/page-pathname-slices/bulk`, slicesHandler),
        graphql.operation(() => HttpResponse.json({})),
      )

      // Act
      const result = await client.getComponentSnapshot(elementTreeId, {
        siteVersion: TestWorkingSiteVersion,
        locale: requestedLocale,
      })

      // Assert
      expect(result.document.locale).toBe(requestedLocale)
      expect(result.cacheData.apiResources.PagePathnameSlice).toEqual([
        {
          id: PAGE_ID,
          value: makePagePathnameSlice(PAGE_ID, { localizedPathname: null }),
          locale: requestedLocale,
        },
      ])

      expect(slicesHandler).toHaveBeenCalledTimes(1)
      expect(slicesHandler.mock.calls[0][0].request.url).toContain(`locale=${requestedLocale}`)
    })

    test('does not introspect an empty document', async () => {
      // Arrange
      const client = createTestClient()
      const elementTreeId = 'site-header-123'
      const slicesHandler = makeSlicesHandler()

      server.use(
        http.get(`${baseUrl}/${encodeURIComponent(elementTreeId)}`, () =>
          HttpResponse.json(makeEmptyDocument(elementTreeId, null), { status: 200 }),
        ),
        http.get(`${runtime.apiOrigin}/v3/page-pathname-slices/bulk`, slicesHandler),
      )

      // Act
      const result = await client.getComponentSnapshot(elementTreeId, {
        siteVersion: TestWorkingSiteVersion,
      })

      // Assert
      expect(result.document.data).toBeNull()
      expect(result.cacheData.apiResources.PagePathnameSlice ?? []).toEqual([])
      expect(slicesHandler).not.toHaveBeenCalled()
    })
  })
})
