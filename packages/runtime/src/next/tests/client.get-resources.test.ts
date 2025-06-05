import { Makeswift } from '../client'
import { http, HttpResponse } from 'msw'

import { ReactRuntime } from '../../runtimes/react'
import { MakeswiftSiteVersion } from '../../api/site-version'

import { server } from '../../mocks/server'

const TEST_API_KEY = 'xxx'
const apiOrigin = 'https://api.fakeswift.com'
const runtime = new ReactRuntime()

function createTestClient() {
  return new Makeswift(TEST_API_KEY, { runtime, apiOrigin })
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
  const resourceUrl = `${apiOrigin}/v2/swatches/${swatchId}`

  test('returns null on 404', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.text('', { status: 404 }), {
        once: true,
      }),
    )

    // Act
    const result = await client.getSwatch(swatchId, MakeswiftSiteVersion.Working)

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
    const result = await client.getSwatch(swatchId, MakeswiftSiteVersion.Working)

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to get swatch 'mySwatch'", {
      response: 'Internal server error',
      siteVersion: 'Working',
    })
  })
})

describe('getTypography', () => {
  const typographyId = 'myTypography'
  const resourceUrl = `${apiOrigin}/v2/typographies/${typographyId}`

  test('returns null on 404', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.text('', { status: 404 }), {
        once: true,
      }),
    )

    // Act
    const result = await client.getTypography(typographyId, MakeswiftSiteVersion.Working)

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
    const result = await client.getTypography(typographyId, MakeswiftSiteVersion.Working)

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to get typography 'myTypography'", {
      response: 'Unauthorized',
      siteVersion: 'Working',
    })
  })
})

describe('getGlobalElement', () => {
  const globalElementId = 'myGlobalElement'
  const resourceUrl = `${apiOrigin}/v2/global-elements/${globalElementId}`

  test('returns null on 404', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.text('', { status: 404 }), {
        once: true,
      }),
    )

    // Act
    const result = await client.getGlobalElement(globalElementId, MakeswiftSiteVersion.Working)

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
    const result = await client.getGlobalElement(globalElementId, MakeswiftSiteVersion.Live)

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to get global element 'myGlobalElement'", {
      response: 'Bad request',
      siteVersion: 'Live',
    })
  })
})

describe('getLocalizedGlobalElement', () => {
  const globalElementId = 'myGlobalElement'
  const locale = 'es-MX'
  const resourceUrl = `${apiOrigin}/v2/localized-global-elements/${globalElementId}`

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
      MakeswiftSiteVersion.Working,
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
    const result = await client.getLocalizedGlobalElement(
      globalElementId,
      locale,
      MakeswiftSiteVersion.Live,
    )

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to get localized global element 'myGlobalElement'",
      {
        response: 'Request timeout',
        locale: 'es-MX',
        siteVersion: 'Live',
      },
    )
  })
})

describe('getPagePathnameSlice', () => {
  const pageId = 'pageId'
  const locale = 'fr'
  const resourceUrl = `${apiOrigin}/v2/page-pathname-slices/bulk`

  test('returns null on all errors, logs details to the console', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(resourceUrl, () => HttpResponse.json('Request timeout', { status: 408 }), {
        once: true,
      }),
    )

    // Act
    const result = await client.getPagePathnameSlice(pageId, MakeswiftSiteVersion.Live, { locale })

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to get page pathname slice(s) for pageId',
      {
        response: 'Request timeout',
        locale: 'fr',
        siteVersion: 'Live',
      },
    )
  })
})
