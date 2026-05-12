import { MakeswiftClient, MakeswiftComponentDocument } from '../../client'
import { http, HttpResponse, graphql } from 'msw'

import { createReactRuntime } from '../../runtimes/react/testing/react-runtime'

import { server } from '../../mocks/server'
import { TestWorkingSiteVersion } from '../../testing/fixtures'
import { CacheData } from '../../api/client'

const TEST_API_KEY = 'myApiKey'
const runtime = createReactRuntime()
const baseUrl = `${runtime.apiOrigin}/v0/element-trees/bulk`

function createTestClient() {
  return new MakeswiftClient(TEST_API_KEY, { runtime })
}

afterEach(() => {
  jest.restoreAllMocks()
})

describe('unstable_getComponentSnapshots', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  function setupGraphqlMock() {
    server.use(
      graphql.operation(() => {
        return HttpResponse.json({})
      }),
    )
  }

  test('returns empty array when ids is empty', async () => {
    // Arrange
    const client = createTestClient()

    // Act
    const results = await client.unstable_getComponentSnapshots([], {
      siteVersion: TestWorkingSiteVersion,
    })

    // Assert
    expect(results).toEqual([])
  })

  test('returns per-component snapshots for all requested IDs (some found, some null)', async () => {
    // Arrange
    const client = createTestClient()
    setupGraphqlMock()

    const documents: (MakeswiftComponentDocument | null)[] = [
      {
        id: 'comp-1',
        name: 'Component A',
        data: { type: 'typeA', key: 'key-1', props: {} },
        locale: null,
        siteId: 'mySiteId',
        inheritsFromParent: false,
      },
      null,
      {
        id: 'comp-3',
        name: 'Component C',
        data: { type: 'typeC', key: 'key-3', props: {} },
        locale: null,
        siteId: 'mySiteId',
        inheritsFromParent: false,
      },
    ]

    server.use(
      http.post(baseUrl, () => HttpResponse.json(documents, { status: 200 }), { once: true }),
    )

    // Act
    const results = await client.unstable_getComponentSnapshots(['comp-1', 'comp-2', 'comp-3'], {
      siteVersion: TestWorkingSiteVersion,
    })

    // Assert
    expect(results).toHaveLength(3)

    // comp-1 found
    expect(results[0].document.id).toBe('comp-1')
    expect(results[0].document.data).not.toBeNull()
    expect(results[0].cacheData).toHaveProperty('apiResources')
    expect(results[0].meta).toEqual({
      allowLocaleFallback: true,
      requestedLocale: null,
    })

    // comp-2 not found — fallback document
    expect(results[1].document.id).toBe('comp-2')
    expect(results[1].document.data).toBeNull()
    expect(results[1].cacheData).toEqual(CacheData.empty())
    expect(results[1].meta).toEqual({
      allowLocaleFallback: true,
      requestedLocale: null,
    })

    // comp-3 found
    expect(results[2].document.id).toBe('comp-3')
    expect(results[2].document.data).not.toBeNull()
  })

  test('throws when bulk fetch fails', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.post(baseUrl, () => HttpResponse.text('Server Error', { status: 500 }), {
        once: true,
      }),
    )

    // Act & Assert
    await expect(
      client.unstable_getComponentSnapshots(['comp-1', 'comp-2'], {
        siteVersion: TestWorkingSiteVersion,
      }),
    ).rejects.toThrow('Failed to get element trees')
  })

  test('locale fallback — second-pass: first call with locale returns some nulls, second call without locale fills them in', async () => {
    // Arrange
    const client = createTestClient()
    setupGraphqlMock()

    const httpHandler = jest.fn<ReturnType<typeof HttpResponse.json>, [{ request: Request }]>()

    // First call: with locale — comp-1 found, comp-2 not found (null)
    httpHandler.mockImplementationOnce(() => {
      return HttpResponse.json(
        [
          {
            id: 'comp-1',
            name: 'Component A',
            data: { type: 'typeA', key: 'key-1', props: {} },
            locale: 'fr-FR',
            siteId: 'mySiteId',
            inheritsFromParent: false,
          },
          null,
        ],
        { status: 200 },
      )
    })

    // Second call: fallback without locale — comp-2 now found
    httpHandler.mockImplementationOnce(() => {
      return HttpResponse.json(
        [
          {
            id: 'comp-2',
            name: 'Component B',
            data: { type: 'typeB', key: 'key-2', props: {} },
            locale: null,
            siteId: 'mySiteId',
            inheritsFromParent: false,
          },
        ],
        { status: 200 },
      )
    })

    server.use(http.post(baseUrl, httpHandler))

    // Act
    const results = await client.unstable_getComponentSnapshots(['comp-1', 'comp-2'], {
      siteVersion: TestWorkingSiteVersion,
      locale: 'fr-FR',
    })

    // Assert
    expect(httpHandler).toHaveBeenCalledTimes(2)

    // First call should have locale in body
    const firstCallBody = await httpHandler.mock.calls[0]![0].request.clone().json()
    expect(firstCallBody.locale).toBe('fr-FR')

    // Second call (fallback) should NOT have locale in body
    const secondCallBody = await httpHandler.mock.calls[1]![0].request.clone().json()
    expect(secondCallBody.locale).toBeUndefined()

    expect(results).toHaveLength(2)

    // comp-1 was found with locale
    expect(results[0].document.id).toBe('comp-1')
    expect(results[0].document.data).not.toBeNull()
    expect(results[0].meta.requestedLocale).toBe('fr-FR')

    // comp-2 was filled in via fallback
    expect(results[1].document.id).toBe('comp-2')
    expect(results[1].document.data).not.toBeNull()
    expect(results[1].meta.requestedLocale).toBe('fr-FR')
  })

  test('does not attempt locale fallback when allowLocaleFallback is false', async () => {
    // Arrange
    const client = createTestClient()
    setupGraphqlMock()

    const httpHandler = jest.fn(() => {
      return HttpResponse.json(
        [
          {
            id: 'comp-1',
            name: 'Component A',
            data: { type: 'typeA', key: 'key-1', props: {} },
            locale: 'fr-FR',
            siteId: 'mySiteId',
            inheritsFromParent: false,
          },
          null,
        ],
        { status: 200 },
      )
    })

    server.use(http.post(baseUrl, httpHandler))

    // Act
    const results = await client.unstable_getComponentSnapshots(['comp-1', 'comp-2'], {
      siteVersion: TestWorkingSiteVersion,
      locale: 'fr-FR',
      allowLocaleFallback: false,
    })

    // Assert — only one call, no fallback
    expect(httpHandler).toHaveBeenCalledTimes(1)

    expect(results).toHaveLength(2)
    expect(results[0].document.data).not.toBeNull()
    expect(results[1].document.data).toBeNull()
    expect(results[1].meta).toEqual({
      allowLocaleFallback: false,
      requestedLocale: 'fr-FR',
    })
  })
})
