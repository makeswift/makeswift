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
    const payload: GetFontsAPI = { googleFonts: [], siteId: TEST_SITE_ID }

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

  test.each([
    { status: 400, statusText: 'Bad Request' },
    { status: 500, statusText: 'Internal Server Error' },
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
