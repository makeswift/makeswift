import { MakeswiftClient, MakeswiftComponentDocument } from '../../client'
import { http, HttpResponse, graphql } from 'msw'

import { ReactRuntime } from '../../runtimes/react'

import { server } from '../../mocks/server'
import { TestWorkingSiteVersion, TestOrigins } from '../../testing/fixtures'

const TEST_API_KEY = 'myApiKey'
const baseUrl = `${TestOrigins.apiOrigin}/v2_unstable/element-trees`
const runtime = new ReactRuntime()

function createTestClient() {
  return new MakeswiftClient(TEST_API_KEY, { runtime, apiOrigin: TestOrigins.apiOrigin })
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
})
