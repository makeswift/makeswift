import { MakeswiftClient, type MakeswiftPageDocument } from '../../client'
import { http, HttpResponse } from 'msw'

import { ReactRuntime } from '../../runtimes/react'

import { server } from '../../mocks/server'
import { TestOrigins, TestWorkingSiteVersion } from '../../testing/fixtures'

const TEST_API_KEY = 'myApiKey'
const { apiOrigin } = TestOrigins
const runtime = new ReactRuntime()

function createTestClient() {
  return new MakeswiftClient(TEST_API_KEY, { runtime, apiOrigin })
}

let consoleErrorSpy: jest.SpyInstance

const pageDocument: MakeswiftPageDocument = {
  id: '[page-id]',
  site: {
    id: '[site-id]',
  },
  data: {
    type: '[element-type]',
    key: '[element-key]',
    props: {},
  },
  snippets: [],
  fonts: [],
  meta: {},
  seo: {},
  localizedPages: [],
  locale: null,
}

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  consoleErrorSpy.mockRestore()
})

describe('getPageSnapshot', () => {
  const pathname = 'blog/hello-world'
  const snapshotUrl = `${apiOrigin}/v4/pages/${encodeURIComponent(pathname)}/document`
  const graphqlUrl = `${apiOrigin}/graphql`
  const locale = 'es-MX'

  test.each([undefined, 'fr', 'es-MX'])(
    'correctly passes `locale` parameter (%s)',
    async locale => {
      // Arrange
      const client = createTestClient()

      server.use(
        // page snapshot request
        http.get(
          snapshotUrl,
          ({ request }) => {
            const url = new URL(request.url)
            return HttpResponse.json(
              { ...pageDocument, locale: url.searchParams.get('locale') },
              { status: 200 },
            )
          },
          {
            once: true,
          },
        ),
        // introspection query
        http.post(graphqlUrl, () => HttpResponse.json({}, { status: 200 }), {
          once: true,
        }),
      )

      // Act
      const result = await client.getPageSnapshot(pathname, {
        locale,
        siteVersion: TestWorkingSiteVersion,
      })

      // Assert
      expect(result?.cacheData).toMatchSnapshot()
      expect(result?.document.locale).toEqual(locale ?? null)
    },
  )

  test.each([
    [undefined, '[fallback-page-id]'],
    [true, '[fallback-page-id]'],
    [false, '[page-id]'],
  ])(
    'correctly passes `allowLocaleFallback` parameter (%s)',
    async (allowLocaleFallback, expectedPageId) => {
      // Arrange
      const client = createTestClient()

      server.use(
        // page snapshot request
        http.get(
          snapshotUrl,
          ({ request }) => {
            const url = new URL(request.url)
            const allowFallback = url.searchParams.get('allowLocaleFallback') === 'true'
            return HttpResponse.json(
              {
                ...pageDocument,
                id: allowFallback ? '[fallback-page-id]' : '[page-id]',
              },
              { status: 200 },
            )
          },
          {
            once: true,
          },
        ),
        // introspection query
        http.post(graphqlUrl, () => HttpResponse.json({}, { status: 200 }), {
          once: true,
        }),
      )

      // Act
      const result = await client.getPageSnapshot(pathname, {
        locale,
        allowLocaleFallback,
        siteVersion: TestWorkingSiteVersion,
      })

      // Assert
      expect(result?.document.id).toEqual(expectedPageId)
    },
  )

  test('returns null on 404', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(snapshotUrl, () => HttpResponse.text('', { status: 404 }), {
        once: true,
      }),
    )

    // Act
    const result = await client.getPageSnapshot(pathname, {
      locale,
      siteVersion: TestWorkingSiteVersion,
    })

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('throws on errors other than 404, logs details to the console', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(snapshotUrl, () => HttpResponse.text('Internal server error', { status: 500 }), {
        once: true,
      }),
    )

    // Act
    const resultPromise = client.getPageSnapshot(pathname, {
      siteVersion: null,
      locale,
    })

    try {
      await resultPromise
    } catch (e) {}

    // Assert
    expect(resultPromise).rejects.toThrow(
      "Failed to get page snapshot for 'blog/hello-world': 500 Internal Server Error",
    )

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to get page snapshot for 'blog/hello-world'",
      {
        response: 'Internal server error',
        siteVersion: null,
        locale: 'es-MX',
      },
    )
  })
})
