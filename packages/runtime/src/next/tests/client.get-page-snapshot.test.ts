import { Makeswift } from '../client'
import { http, HttpResponse } from 'msw'

import { ReactRuntime } from '../../runtimes/react'

import { server } from '../../mocks/server'
import { MakeswiftSiteVersion } from '../../api/site-version'

const TEST_API_KEY = 'myApiKey'
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

describe('getPageSnapshot', () => {
  const pathname = 'blog/hello-world'
  const snapshotUrl = `${apiOrigin}/v3/pages/${encodeURIComponent(pathname)}/document`
  const locale = 'es-MX'

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
      siteVersion: MakeswiftSiteVersion.Working,
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
      siteVersion: MakeswiftSiteVersion.Live,
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
        siteVersion: 'Live',
        locale: 'es-MX',
      },
    )
  })
})
