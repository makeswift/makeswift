import { GetFontsAPI, MakeswiftClient } from '../../client'
import { http, HttpResponse } from 'msw'

import { createReactRuntime } from '../../runtimes/react/testing/react-runtime'

import { server } from '../../mocks/server'
import { TestWorkingSiteVersion } from '../../testing/fixtures'

const TEST_API_KEY = 'xxx'
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
    const payload: GetFontsAPI = { googleFonts: [] }

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
    { status: 400, label: '400' },
    { status: 500, label: '500' },
  ])('returns null and logs error when response is $label', async ({ status }) => {
    // Arrange
    const client = createTestClient()
    const errorResponseBody = 'Error response body'

    server.use(
      http.get(baseUrl, () => HttpResponse.json(errorResponseBody, { status }), {
        once: true,
      }),
    )

    // Act
    const result = await client.unstable_getFonts(TestWorkingSiteVersion)

    // Assert
    expect(result).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch fonts', {
      response: errorResponseBody,
      siteVersion: TestWorkingSiteVersion,
    })
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
