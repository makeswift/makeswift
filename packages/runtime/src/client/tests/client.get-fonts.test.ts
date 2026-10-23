import { GetFontsAPI, MakeswiftClient } from '../../client'
import { http, HttpResponse } from 'msw'

import { type RestApiClientError } from '../../api/rest-api-client'
import { createReactRuntime } from '../../runtimes/react/testing/react-runtime'

import { server } from '../../mocks/server'
import { TestWorkingSiteVersion } from '../../testing/fixtures'

const TEST_API_KEY = 'xxx'

// base64 encoding of 'Site:00000000-0000-0000-0000-000000000000'
const TEST_SITE_ID = 'U2l0ZTowMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDA='

const runtime = createReactRuntime()
const baseUrl = `${runtime.apiOrigin}/v1_unstable/fonts`

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

describe('getFonts', () => {
  test('successfully parses response containing no fonts', async () => {
    // Arrange
    const client = createTestClient()
    const payload: GetFontsAPI = { customFontVariants: [], googleFonts: [], siteId: TEST_SITE_ID }

    server.use(
      http.get(baseUrl, () => HttpResponse.json(payload), {
        once: true,
      }),
    )

    // Act
    const result = await client.unstable_getFonts(TestWorkingSiteVersion)

    // Assert
    expect(result).toEqual(payload)
  })

  test('successfully parses google fonts contained in response', async () => {
    // Arrange
    const client = createTestClient()
    const payload: GetFontsAPI = {
      customFontVariants: [],
      googleFonts: [
        { family: 'Roboto', variants: ['400', '700'] },
        { family: 'Open Sans', variants: ['400', '400italic', '700'] },
      ],
      siteId: TEST_SITE_ID,
    }

    server.use(
      http.get(baseUrl, () => HttpResponse.json(payload), {
        once: true,
      }),
    )

    // Act
    const result = await client.unstable_getFonts(TestWorkingSiteVersion)

    // Assert
    expect(result).toEqual(payload)
  })

  test('successfully parses custom font variants contained in response', async () => {
    // Arrange
    const client = createTestClient()
    const payload: GetFontsAPI = {
      customFontVariants: [
        {
          id: 'variant-400',
          family: 'Brand Sans',
          weight: 400,
          style: 'normal',
          fileUrl: 'https://fonts.example.com/brand-400.woff2',
          fileFormat: 'woff2',
        },
        {
          id: 'variant-700-italic',
          family: 'Brand Sans',
          weight: 700,
          style: 'italic',
          fileUrl: 'https://fonts.example.com/brand-700-italic.woff',
          fileFormat: 'woff',
        },
      ],
      googleFonts: [{ family: 'Roboto', variants: ['400'] }],
      siteId: TEST_SITE_ID,
    }

    server.use(
      http.get(baseUrl, () => HttpResponse.json(payload), {
        once: true,
      }),
    )

    // Act
    const result = await client.unstable_getFonts(TestWorkingSiteVersion)

    // Assert
    expect(result).toEqual(payload)
  })

  test('defaults custom font variants to empty when the response omits them', async () => {
    // Arrange
    const client = createTestClient()
    const payload = {
      googleFonts: [{ family: 'Roboto', variants: ['400'] }],
      siteId: TEST_SITE_ID,
    }

    server.use(
      http.get(baseUrl, () => HttpResponse.json(payload), {
        once: true,
      }),
    )

    // Act
    const result = await client.unstable_getFonts(TestWorkingSiteVersion)

    // Assert
    expect(result).toEqual({ ...payload, customFontVariants: [] })
  })

  test.each([
    { label: 'a file URL that is not a URL', override: { fileUrl: 'not a url' } },
    { label: 'a non-numeric weight', override: { weight: '400' } },
    { label: 'a missing family', override: { family: undefined } },
  ])('returns null and logs error for a custom font variant with $label', async ({ override }) => {
    // Arrange
    const client = createTestClient()
    const payload = {
      customFontVariants: [
        {
          id: 'variant',
          family: 'Brand Sans',
          weight: 400,
          style: 'normal',
          fileUrl: 'https://fonts.example.com/brand.woff2',
          fileFormat: 'woff2',
          ...override,
        },
      ],
      googleFonts: [],
      siteId: TEST_SITE_ID,
    }

    server.use(
      http.get(baseUrl, () => HttpResponse.json(payload), {
        once: true,
      }),
    )

    // Act
    const result = await client.unstable_getFonts(TestWorkingSiteVersion)

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to parse fonts API response', {
      response: JSON.parse(JSON.stringify(payload)),
      siteVersion: TestWorkingSiteVersion,
    })
  })

  test('returns null when the response is 404', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(baseUrl, () => HttpResponse.json('Not Found', { status: 404 }), {
        once: true,
      }),
    )

    // Act
    const result = await client.unstable_getFonts(TestWorkingSiteVersion)

    // Assert
    expect(result).toBeNull()
  })

  test.each([
    { status: 400, statusText: 'Bad Request' },
    { status: 403, statusText: 'Forbidden' },
  ])('throws when response is $status', async ({ status, statusText }) => {
    // Arrange
    const client = createTestClient()
    const errorResponseBody = 'Error response body'

    server.use(
      http.get(baseUrl, () => HttpResponse.json(errorResponseBody, { status }), {
        once: true,
      }),
    )

    // Act
    const error = await client
      .unstable_getFonts(TestWorkingSiteVersion)
      .then(() => null)
      .catch((e: RestApiClientError) => e)

    // Assert
    expect(error?.message).toBe(`Failed to fetch fonts: ${status} ${statusText}`)
    expect(error?.status).toBe(status)
    expect(error?.cause).toEqual({
      body: errorResponseBody,
      siteVersion: TestWorkingSiteVersion,
    })
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('returns null and logs error on failure to parse the response', async () => {
    // Arrange
    const client = createTestClient()
    const unexpectedPayload = [{}]

    server.use(
      http.get(baseUrl, () => HttpResponse.json(unexpectedPayload), {
        once: true,
      }),
    )

    // Act
    const result = await client.unstable_getFonts(TestWorkingSiteVersion)

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to parse fonts API response', {
      response: unexpectedPayload,
      siteVersion: TestWorkingSiteVersion,
    })
  })
})
