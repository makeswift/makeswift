import { MakeswiftRestAPIClient, RestApiClientError } from '../rest-api-client'
import { http, HttpResponse } from 'msw'

import { server } from '../../mocks/server'
import { TestOrigins, TestWorkingSiteVersion } from '../../testing/fixtures'

const TEST_API_KEY = 'xxx'
const baseUrl = `${TestOrigins.apiOrigin}/v3`

function createTestClient() {
  return new MakeswiftRestAPIClient({
    fetch: globalThis.fetch,
    apiKey: TEST_API_KEY,
    apiOrigin: TestOrigins.apiOrigin,
  })
}

async function captureClientError(promise: Promise<unknown>): Promise<RestApiClientError> {
  try {
    await promise
  } catch (error) {
    if (error instanceof RestApiClientError) return error

    throw new Error(`Expected a RestApiClientError, but got: ${error}`)
  }

  throw new Error('Expected the request to fail, but it succeeded')
}

let consoleErrorSpy: jest.SpyInstance

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  consoleErrorSpy.mockRestore()
})

describe('getSwatch', () => {
  const swatchId = 'mySwatch'
  const resourceUrl = `${baseUrl}/swatches/${swatchId}`

  test('returns null on 404', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.text('', { status: 404 }), {
        once: true,
      }),
    )

    // Act
    const result = await client.getSwatch(swatchId, TestWorkingSiteVersion)

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('throws on other errors, attaching the details to the error', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.json('Internal server error', { status: 500 }), {
        once: true,
      }),
    )

    // Act
    const error = await captureClientError(client.getSwatch(swatchId, TestWorkingSiteVersion))

    // Assert
    expect(error.name).toBe('RestApiClientError')
    expect(error.message).toBe("Failed to get swatch 'mySwatch': 500 Internal Server Error")
    expect(error.status).toBe(500)
    expect(error.cause).toEqual({
      body: 'Internal server error',
      siteVersion: TestWorkingSiteVersion,
    })
  })
})

describe('getFile', () => {
  const fileId = 'myFile'
  const resourceUrl = `${TestOrigins.apiOrigin}/v1/files/${fileId}`

  test('returns null on 404', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.text('', { status: 404 }), {
        once: true,
      }),
    )

    // Act
    const result = await client.getFile(fileId)

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('throws on other errors, attaching the details to the error', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.json('Internal server error', { status: 500 }), {
        once: true,
      }),
    )

    // Act
    const error = await captureClientError(client.getFile(fileId))

    // Assert
    expect(error.name).toBe('RestApiClientError')
    expect(error.message).toBe("Failed to get file 'myFile': 500 Internal Server Error")
    expect(error.status).toBe(500)
    expect(error.cause).toEqual({
      body: 'Internal server error',
    })
  })
})

describe('getTable', () => {
  const tableId = 'myTable'
  const resourceUrl = `${TestOrigins.apiOrigin}/v1/tables/${tableId}`

  test('returns null on 404', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.text('', { status: 404 }), {
        once: true,
      }),
    )

    // Act
    const result = await client.getTable(tableId)

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('throws on other errors, attaching the details to the error', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.json('Internal server error', { status: 500 }), {
        once: true,
      }),
    )

    // Act
    const error = await captureClientError(client.getTable(tableId))

    // Assert
    expect(error.name).toBe('RestApiClientError')
    expect(error.message).toBe("Failed to get table 'myTable': 500 Internal Server Error")
    expect(error.status).toBe(500)
    expect(error.cause).toEqual({
      body: 'Internal server error',
    })
  })
})

describe('getTypography', () => {
  const typographyId = 'myTypography'
  const resourceUrl = `${baseUrl}/typographies/${typographyId}`

  test('returns null on 404', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.text('', { status: 404 }), {
        once: true,
      }),
    )

    // Act
    const result = await client.getTypography(typographyId, TestWorkingSiteVersion)

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('throws on other errors, attaching the details to the error', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.json('Unauthorized', { status: 401 }), {
        once: true,
      }),
    )

    // Act
    const error = await captureClientError(
      client.getTypography(typographyId, TestWorkingSiteVersion),
    )

    // Assert
    expect(error.message).toBe("Failed to get typography 'myTypography': 401 Unauthorized")
    expect(error.cause).toEqual({ body: 'Unauthorized', siteVersion: TestWorkingSiteVersion })
  })
})

describe('getGlobalElement', () => {
  const globalElementId = 'myGlobalElement'
  const resourceUrl = `${baseUrl}/global-elements/${globalElementId}`

  test('returns null on 404', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.text('', { status: 404 }), {
        once: true,
      }),
    )

    // Act
    const result = await client.getGlobalElement(globalElementId, TestWorkingSiteVersion)

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('throws on other errors, attaching the details to the error', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.json('Bad request', { status: 400 }), {
        once: true,
      }),
    )

    // Act
    const error = await captureClientError(client.getGlobalElement(globalElementId, null))

    // Assert
    expect(error.message).toBe("Failed to get global element 'myGlobalElement': 400 Bad Request")
    expect(error.cause).toEqual({ body: 'Bad request', siteVersion: null })
  })
})

describe('getLocalizedGlobalElement', () => {
  const globalElementId = 'myGlobalElement'
  const locale = 'es-MX'
  const resourceUrl = `${baseUrl}/localized-global-elements/${globalElementId}`

  test('returns null on 404', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.text('', { status: 404 }), {
        once: true,
      }),
    )

    // Act
    const result = await client.getLocalizedGlobalElement(
      globalElementId,
      locale,
      TestWorkingSiteVersion,
    )

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('throws on other errors, attaching the details to the error', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.json('Request timeout', { status: 408 }), {
        once: true,
      }),
    )

    // Act
    const error = await captureClientError(
      client.getLocalizedGlobalElement(globalElementId, locale, null),
    )

    // Assert
    expect(error.message).toBe(
      "Failed to get localized global element 'myGlobalElement': 408 Request Timeout",
    )
    expect(error.cause).toEqual({
      body: 'Request timeout',
      locale: 'es-MX',
      siteVersion: null,
    })
  })
})

describe('getGlobalElements', () => {
  const resourceUrl = `${TestOrigins.apiOrigin}/content/v1/global-elements/bulk`

  test('returns an empty array without a request when given no ids', async () => {
    // Arrange
    const client = createTestClient()
    const handler = jest.fn(() => HttpResponse.json([]))
    server.use(http.get(resourceUrl, handler, { once: true }))

    // Act
    const result = await client.getGlobalElements([], TestWorkingSiteVersion)

    // Assert
    expect(result).toEqual([])
    expect(handler).not.toHaveBeenCalled()
  })

  test('sends all ids as repeated query params, omits locale by default, and returns the response in order', async () => {
    // Arrange
    const client = createTestClient()
    const handler = jest.fn(({ request }: { request: Request }) => {
      const ids = new URL(request.url).searchParams.getAll('ids')
      return HttpResponse.json(
        ids.map(id => ({
          base: id === 'b' ? null : { id, data: {} },
          localized: null,
        })),
      )
    })
    server.use(http.get(resourceUrl, handler, { once: true }))

    // Act
    const result = await client.getGlobalElements(['a', 'b', 'c'], TestWorkingSiteVersion)

    // Assert
    const url = new URL(handler.mock.calls[0]![0].request.url)
    expect(url.searchParams.getAll('ids')).toEqual(['a', 'b', 'c'])
    expect(url.searchParams.has('locale')).toBe(false)
    expect(result).toEqual([
      { base: { id: 'a', data: {} }, localized: null },
      { base: null, localized: null },
      { base: { id: 'c', data: {} }, localized: null },
    ])
  })

  test('sends the locale as a query param when provided', async () => {
    // Arrange
    const client = createTestClient()
    const handler = jest.fn(({ request }: { request: Request }) => {
      const ids = new URL(request.url).searchParams.getAll('ids')
      return HttpResponse.json(
        ids.map(id => ({
          base: { id, data: {} },
          localized: { id: `${id}-es-MX`, data: {} },
        })),
      )
    })
    server.use(http.get(resourceUrl, handler, { once: true }))

    // Act
    const result = await client.getGlobalElements(['a'], TestWorkingSiteVersion, {
      locale: 'es-MX',
    })

    // Assert
    expect(new URL(handler.mock.calls[0]![0].request.url).searchParams.get('locale')).toBe('es-MX')
    expect(result).toEqual([
      { base: { id: 'a', data: {} }, localized: { id: 'a-es-MX', data: {} } },
    ])
  })

  test('returns all-null entries on 404', async () => {
    // Arrange
    const client = createTestClient()

    server.use(http.get(resourceUrl, () => HttpResponse.text('', { status: 404 }), { once: true }))

    // Act
    const result = await client.getGlobalElements(['a', 'b'], TestWorkingSiteVersion)

    // Assert
    expect(result).toEqual([
      { base: null, localized: null },
      { base: null, localized: null },
    ])
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('throws on other errors, attaching the details to the error', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.json('Bad request', { status: 400 }), {
        once: true,
      }),
    )

    // Act
    const error = await captureClientError(
      client.getGlobalElements(['a', 'b'], null, { locale: 'es-MX' }),
    )

    // Assert
    expect(error.message).toBe('Failed to get global elements for [a, b]: 400 Bad Request')
    expect(error.cause).toEqual({ body: 'Bad request', siteVersion: null, locale: 'es-MX' })
  })

  test('splits more than 100 ids across requests and preserves order', async () => {
    // Arrange
    const client = createTestClient()
    const ids = Array.from({ length: 250 }, (_, i) => `id-${i}`)
    const handler = jest.fn(({ request }: { request: Request }) => {
      const requested = new URL(request.url).searchParams.getAll('ids')
      return HttpResponse.json(requested.map(id => ({ base: { id, data: {} }, localized: null })))
    })
    server.use(http.get(resourceUrl, handler))

    // Act
    const result = await client.getGlobalElements(ids, TestWorkingSiteVersion)

    // Assert
    expect(handler).toHaveBeenCalledTimes(3)
    expect(
      handler.mock.calls.map(([{ request }]) => new URL(request.url).searchParams.getAll('ids')),
    ).toEqual([ids.slice(0, 100), ids.slice(100, 200), ids.slice(200)])
    expect(result.map(entry => entry.base?.id)).toEqual(ids)
  })
})

describe('getPagePathnameSlice', () => {
  const pageId = 'pageId'
  const locale = 'fr'
  const resourceUrl = `${baseUrl}/page-pathname-slices/bulk`

  test('throws on errors, attaching the details to the error', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.json('Request timeout', { status: 408 }), {
        once: true,
      }),
    )

    // Act
    const error = await captureClientError(client.getPagePathnameSlice(pageId, null, { locale }))

    // Assert
    expect(error.message).toBe(
      'Failed to get page pathname slice(s) for pageId: 408 Request Timeout',
    )
    expect(error.cause).toEqual({ body: 'Request timeout', locale: 'fr', siteVersion: null })
  })
})
