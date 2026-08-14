import { http, HttpResponse } from 'msw'

import { MakeswiftRestAPIClient, RestApiClientError } from '../rest-api-client'

import { server } from '../../mocks/server'
import { TestOrigins, TestWorkingSiteVersion, makeSwatch } from '../../testing/fixtures'

const TEST_API_KEY = 'xxx'
const swatchId = 'mySwatch'
const resourceUrl = `${TestOrigins.apiOrigin}/v3/swatches/${swatchId}`

function createTestClient() {
  return new MakeswiftRestAPIClient({
    fetch: globalThis.fetch,
    apiKey: TEST_API_KEY,
    apiOrigin: TestOrigins.apiOrigin,
  })
}

// Responds with `status` for the first `failureCount` requests, then with the
// given swatch, counting every request it receives along the way.
function respondAfterFailures(
  status: number,
  failureCount: number,
): { requestCount: () => number } {
  let requestCount = 0

  server.use(
    http.get(resourceUrl, () => {
      requestCount++

      return requestCount <= failureCount
        ? HttpResponse.json('Rate limited', { status })
        : HttpResponse.json(makeSwatch(swatchId))
    }),
  )

  return { requestCount: () => requestCount }
}

let consoleErrorSpy: jest.SpyInstance

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  consoleErrorSpy.mockRestore()
})

describe('rate limiting', () => {
  test('retries rate limited requests and returns the eventual success', async () => {
    // Arrange
    const client = createTestClient()
    const { requestCount } = respondAfterFailures(429, 2)

    // Act
    const result = await client.getSwatch(swatchId, TestWorkingSiteVersion)

    // Assert
    expect(result).toStrictEqual(makeSwatch(swatchId))
    expect(requestCount()).toBe(3)
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('gives up after exhausting its retries', async () => {
    // Arrange
    const client = createTestClient()
    const { requestCount } = respondAfterFailures(429, 1_000)

    // Act
    const error = await client
      .getSwatch(swatchId, TestWorkingSiteVersion)
      .then(() => null)
      .catch((e: RestApiClientError) => e)

    // Assert
    expect(error?.message).toBe("Failed to get swatch 'mySwatch': 429 Too Many Requests")
    expect(error?.cause).toEqual({ body: 'Rate limited', siteVersion: TestWorkingSiteVersion })

    // The initial request, plus three retries.
    expect(requestCount()).toBe(4)
  }, 15_000)

  test('honors the `Retry-After` header', async () => {
    // Arrange
    const client = createTestClient()
    let requestCount = 0

    // Retry-After value that doesn't match the current backoff delay
    const retryAfterSeconds = 3

    server.use(
      http.get(resourceUrl, () => {
        requestCount++

        return requestCount === 1
          ? HttpResponse.json('Rate limited', {
              status: 429,
              headers: { 'Retry-After': String(retryAfterSeconds) },
            })
          : HttpResponse.json(makeSwatch(swatchId))
      }),
    )

    // Act
    const start = Date.now()
    const result = await client.getSwatch(swatchId, TestWorkingSiteVersion)
    const elapsedMs = Date.now() - start

    // Assert
    expect(result).toStrictEqual(makeSwatch(swatchId))
    expect(requestCount).toBe(2)

    const toleranceMs = 500
    const retryAfterMs = retryAfterSeconds * 1000
    // The client should have waited (approximately) the `Retry-After` delay
    // before retrying.
    expect(elapsedMs).toBeGreaterThanOrEqual(retryAfterMs - toleranceMs)
    expect(elapsedMs).toBeLessThan(retryAfterMs + toleranceMs)
  })
})

describe.each([
  ['408 Request Timeout', 408],
  ['500 Internal Server Error', 500],
  ['503 Service Unavailable', 503],
])('%s', (_name, status) => {
  test('is not retried', async () => {
    // Arrange
    const client = createTestClient()
    const { requestCount } = respondAfterFailures(status, 1)

    // Act & Assert
    await expect(client.getSwatch(swatchId, TestWorkingSiteVersion)).rejects.toThrow(
      `Failed to get swatch 'mySwatch': ${status}`,
    )

    expect(requestCount()).toBe(1)
  })
})
