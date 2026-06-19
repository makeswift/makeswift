import { MakeswiftClient, MakeswiftComponentDocument } from '../../client'
import { http, HttpResponse, graphql } from 'msw'

import { createReactRuntime } from '../../runtimes/react/testing/react-runtime'

import { server } from '../../mocks/server'
import { makePagePathnameSlice, TestWorkingSiteVersion } from '../../testing/fixtures'
import { Link } from '../../controls'

const TEST_API_KEY = 'myApiKey'
const runtime = createReactRuntime()
const baseUrl = `${runtime.apiOrigin}/v2/element-trees`

function createTestClient() {
  return new MakeswiftClient(TEST_API_KEY, { runtime })
}

afterEach(() => {
  jest.resetAllMocks()
})

describe('getComponentSnapshot using v2 element tree endpoint', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  test('return null document data on 404', async () => {
    // Arrange
    const client = createTestClient()
    const treeId = 'myTree'
    server.use(
      http.get(`${baseUrl}/${treeId}`, () => HttpResponse.text('', { status: 404 }), {
        once: true,
      }),
    )

    // Act
    const result = await client.getComponentSnapshot(treeId, {
      siteVersion: TestWorkingSiteVersion,
    })

    // Assert
    expect(result.document).not.toBeNull()
    expect(result.document.id).toBe(treeId)
    expect(result.document.data).toBeNull()
  })

  test('return null document data on a 200 `{ notFound: true }` response', async () => {
    // Arrange
    const client = createTestClient()
    const treeId = 'myTree'
    server.use(
      http.get(
        `${baseUrl}/${treeId}`,
        () => HttpResponse.json({ notFound: true }, { status: 200 }),
        { once: true },
      ),
    )

    // Act
    const result = await client.getComponentSnapshot(treeId, {
      siteVersion: TestWorkingSiteVersion,
    })

    // Assert
    expect(result.document).not.toBeNull()
    expect(result.document.id).toBe(treeId)
    expect(result.document.data).toBeNull()
  })

  test('omits the `unstable_enforceSuccess` QSP when `unstable_enforceSuccess` is false', async () => {
    // Arrange
    const client = createTestClient()
    const treeId = 'myTree'
    const httpHandler = jest.fn(({ request }) => {
      void request
      return HttpResponse.text('', { status: 404 })
    })
    server.use(http.get(`${baseUrl}/${treeId}`, httpHandler))

    // Act
    await client.getComponentSnapshot(treeId, {
      siteVersion: TestWorkingSiteVersion,
      unstable_enforceSuccess: false,
    })

    // Assert
    expect(httpHandler.mock.calls[0][0].request.url).not.toContain('unstable_enforceSuccess')
  })

  test('performs locale fallback on a 200 `{ notFound: true }` response', async () => {
    // Arrange
    const client = createTestClient()
    const localeToTest = 'fr-FR'
    const treeId = 'myTree123'
    const elementTreeKey = 'abc123'
    const document: MakeswiftComponentDocument = {
      id: treeId,
      name: 'myElementTree',
      data: {
        type: 'myType',
        key: elementTreeKey,
        props: {},
      },
      locale: null,
      siteId: 'mySiteId',
      inheritsFromParent: false,
    }

    const httpHandler = jest.fn(({ request }) => {
      const { searchParams } = new URL(request.url)
      if (searchParams.get('locale') === localeToTest) {
        return HttpResponse.json({ notFound: true }, { status: 200 })
      }

      return HttpResponse.json(document, { status: 200 })
    })

    server.use(
      http.get(`${baseUrl}/${encodeURIComponent(treeId)}`, httpHandler),
      graphql.operation(() => {
        return HttpResponse.json({})
      }),
    )

    // Act
    const result = await client.getComponentSnapshot(treeId, {
      siteVersion: TestWorkingSiteVersion,
      locale: localeToTest,
    })

    // Assert
    expect(result.document.data?.key).toBe(elementTreeKey)
    expect(result.document.locale).toBeNull()
    expect(httpHandler).toHaveBeenCalledTimes(2)
  })

  test('throws on errors other than 404', async () => {
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
    expect(resultPromise).rejects.toThrow(
      "Failed to get component snapshot for 'myTree': 400 Bad Request",
    )
  })

  test.each([
    { treeId: 'myTree123', locale: 'fr-FR' },
    { treeId: 'unsafe:url;chars=@&?❔🤷', locale: 'fr-FR' },
    { treeId: '/blog/slug', locale: 'en-US' },
  ])(
    "successfully performs locale fallback by requesting base locale tree after receiving a 404 response for the element tree '$treeId' with the '$locale' locale",
    async ({ treeId, locale }) => {
      // Arrange
      const client = createTestClient()
      const localeToTest = locale
      const baseLocale = null

      // mock base locale tree document
      const elementTreeName = 'myElementTree'
      const elementTreeKey = 'abc123'
      const document: MakeswiftComponentDocument = {
        id: treeId,
        name: elementTreeName,
        data: {
          type: 'myType',
          key: elementTreeKey,
          props: {},
        },
        locale: baseLocale,
        siteId: 'mySiteId',
        inheritsFromParent: false,
      }

      /*
        Intercept:
        (1) initial request to v1 endpoint for the locale variant tree
        (2) subsequent request to v1 endpoint for the base locale tree
            - this is the step that we're really testing here - we want the logic in getComponentSnapshot to execute this subsequent request
        (3) graphql query for introspection
    */
      const httpHandler = jest.fn(({ request }) => {
        const { searchParams } = new URL(request.url)
        const locale = searchParams.get('locale')
        if (locale === localeToTest) {
          return HttpResponse.text('', { status: 404 })
        }

        return HttpResponse.json(document, { status: 200 })
      })

      server.use(
        http.get(`${baseUrl}/${encodeURIComponent(treeId)}`, httpHandler),
        graphql.operation(() => {
          return HttpResponse.json({})
        }),
      )

      // Act
      const result = await client.getComponentSnapshot(treeId, {
        siteVersion: TestWorkingSiteVersion,
        locale: localeToTest,
      })

      // Assert
      expect(result).not.toBeNull()
      expect(result.document).not.toBeNull()
      expect(result.document.data).not.toBeNull()
      expect(result.document.data?.key).toBe(elementTreeKey)
      expect(result.document.locale).toBeNull()

      expect(httpHandler).toHaveBeenCalledTimes(2)
      expect(httpHandler.mock.calls[0][0].request.url).toContain(`locale=${localeToTest}`)
    },
  )

  test('does not perform locale fallback after receiving a 404 response for a locale variant tree, when allowFallback is false', async () => {
    // Arrange
    const client = createTestClient()
    const localeToTest = 'fr-FR'
    const baseLocale = null

    // mock base locale tree document
    const treeId = 'myTree123'
    const elementTreeName = 'myElementTree'
    const elementTreeKey = 'abc123'
    const document: MakeswiftComponentDocument = {
      id: treeId,
      name: elementTreeName,
      data: {
        type: 'myType',
        key: elementTreeKey,
        props: {},
      },
      locale: baseLocale,
      siteId: 'mySiteId',
      inheritsFromParent: false,
    }

    /*
        Intercept:
        (1) initial request to v1 endpoint for the locale variant tree
        (2) subsequent request to v1 endpoint for the base locale tree
            - should not execute for this test
        (3) graphql query for introspection
      */
    const httpHandler = jest.fn(({ request }) => {
      const { searchParams } = new URL(request.url)
      const locale = searchParams.get('locale')
      if (locale === localeToTest) {
        return HttpResponse.text('', { status: 404 })
      }

      return HttpResponse.json(document, { status: 200 })
    })

    server.use(
      http.get(`${baseUrl}/${encodeURIComponent(treeId)}`, httpHandler),
      graphql.operation(() => {
        return HttpResponse.json({})
      }),
    )

    // Act
    const result = await client.getComponentSnapshot(treeId, {
      siteVersion: TestWorkingSiteVersion,
      locale: localeToTest,
      allowLocaleFallback: false,
    })

    // Assert
    expect(result).not.toBeNull()
    expect(result.document).not.toBeNull()
    expect(result.document.id).toBe(treeId)
    expect(result.document.data).toBeNull()
    expect(result.document.locale).toBe(localeToTest)

    expect(httpHandler).toHaveBeenCalledTimes(1)
    expect(httpHandler.mock.calls[0][0].request.url).toContain(`locale=${localeToTest}`)
  })

  test.each([
    { treeId: 'myTree123', locale: null },
    { treeId: 'unsafe:url;chars=@&?❔🤷', locale: 'fr-FR' },
    { treeId: '/blog/slug', locale: 'en-US' },
  ])(
    "does not perform locale fallback after receiving a 200 response for the element tree '$treeId' with the requested locale '$locale'",
    async ({ treeId, locale }) => {
      // Arrange
      const client = createTestClient()

      // mock locale variant tree document
      const elementTreeName = 'myElementTree'
      const elementTreeKey = 'abc123'
      const document: MakeswiftComponentDocument = {
        id: treeId,
        name: elementTreeName,
        data: {
          type: 'myType',
          key: elementTreeKey,
          props: {},
        },
        locale,
        siteId: 'mySiteId',
        inheritsFromParent: false,
      }

      /*
        Intercept:
        (1) initial request to v1 endpoint for the locale variant tree
        (2) subsequent request to v1 endpoint for the base locale tree
            - should not happen for this test
        (3) graphql query for introspection
      */
      const httpHandler = jest.fn(({ request }) => {
        const { searchParams } = new URL(request.url)
        const requestLocale = searchParams.get('locale')
        if (requestLocale === locale) {
          return HttpResponse.json(document, { status: 200 })
        }

        return HttpResponse.text('', { status: 404 })
      })

      server.use(
        http.get(`${baseUrl}/${encodeURIComponent(treeId)}`, httpHandler),
        graphql.operation(() => {
          return HttpResponse.json({})
        }),
      )

      // Act
      const result = await client.getComponentSnapshot(treeId, {
        siteVersion: TestWorkingSiteVersion,
        locale: locale ?? undefined,
      })

      // Assert
      expect(result).not.toBeNull()
      expect(result.document).not.toBeNull()
      expect(result.document.id).toBe(treeId)
      expect(result.document.locale).toBe(locale)
      expect(result.document.data).not.toBeNull()

      expect(httpHandler).toHaveBeenCalledTimes(1)
      const requestUrl = httpHandler.mock.calls[0][0].request.url
      if (locale !== null) {
        expect(requestUrl).toContain(`locale=${locale}`)
      } else {
        expect(requestUrl).not.toContain('locale=')
      }
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

    test('uses the default locale (null) after falling back from a missing localized tree', async () => {
      // Arrange
      const client = createTestClient()
      const elementTreeId = 'site-header-123'
      const requestedLocale = 'fr-FR'

      const treeHandler = jest.fn(({ request }: { request: Request }) => {
        const locale = new URL(request.url).searchParams.get('locale')
        if (locale === requestedLocale) {
          return HttpResponse.text('', { status: 404 })
        }
        return HttpResponse.json(makeLinkDocument(elementTreeId, null), { status: 200 })
      })
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
  })
})
