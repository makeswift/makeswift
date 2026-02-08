import { MakeswiftClient } from '../../client'
import { http, HttpResponse } from 'msw'

import { createReactRuntime } from '../../runtimes/react/testing/react-runtime'

import { server } from '../../mocks/server'
import { TestWorkingSiteVersion } from '../../testing/fixtures'

const TEST_API_KEY = 'xxx'
const runtime = createReactRuntime()
const baseUrl = `${runtime.apiOrigin}/v3`

function createTestClient() {
  return new MakeswiftClient(TEST_API_KEY, { runtime })
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

  test('returns null on other errors, logs details to the console', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.json('Internal server error', { status: 500 }), {
        once: true,
      }),
    )

    // Act
    const result = await client.getSwatch(swatchId, TestWorkingSiteVersion)

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to get swatch 'mySwatch'", {
      response: 'Internal server error',
      siteVersion: TestWorkingSiteVersion,
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

  test('returns null on other errors, logs details to the console', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.json('Unauthorized', { status: 401 }), {
        once: true,
      }),
    )

    // Act
    const result = await client.getTypography(typographyId, TestWorkingSiteVersion)

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to get typography 'myTypography'", {
      response: 'Unauthorized',
      siteVersion: TestWorkingSiteVersion,
    })
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

  test('returns null on other errors, logs details to the console', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.json('Bad request', { status: 400 }), {
        once: true,
      }),
    )

    // Act
    const result = await client.getGlobalElement(globalElementId, null)

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to get global element 'myGlobalElement'", {
      response: 'Bad request',
      siteVersion: null,
    })
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

  test('returns null on other errors, logs details to the console', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.json('Request timeout', { status: 408 }), {
        once: true,
      }),
    )

    // Act
    const result = await client.getLocalizedGlobalElement(globalElementId, locale, null)

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to get localized global element 'myGlobalElement'",
      {
        response: 'Request timeout',
        locale: 'es-MX',
        siteVersion: null,
      },
    )
  })
})

describe('getPagePathnameSlice', () => {
  const pageId = 'pageId'
  const locale = 'fr'
  const resourceUrl = `${baseUrl}/page-pathname-slices/bulk`

  test('returns null on all errors, logs details to the console', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.json('Request timeout', { status: 408 }), {
        once: true,
      }),
    )

    // Act
    const result = await client.getPagePathnameSlice(pageId, null, { locale })

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to get page pathname slice(s) for pageId',
      {
        response: 'Request timeout',
        locale: 'fr',
        siteVersion: null,
      },
    )
  })
})
