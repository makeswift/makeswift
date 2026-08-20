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
