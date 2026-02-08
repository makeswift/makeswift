import { MakeswiftClient } from '../../client'
import { http, HttpResponse } from 'msw'
import { randomUUID } from 'crypto'

import { createReactRuntime } from '../../runtimes/react/testing/react-runtime'

import { server } from '../../mocks/server'

function createRandomPageV4() {
  const id = randomUUID()
  return {
    id,
    path: `/${id}`,
    title: null,
    description: null,
    canonicalUrl: null,
    socialImageUrl: null,
    sitemapPriority: null,
    sitemapFrequency: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    isOnline: true,
    excludedFromSearch: false,
    locale: 'en-US',
    localizedVariants: [],
  }
}

const TEST_API_KEY = 'xxx'
const runtime = createReactRuntime()
const baseUrl = `${runtime.apiOrigin}/v5/pages`

function createTestClient() {
  return new MakeswiftClient(TEST_API_KEY, { runtime })
}

describe('getPages v5', () => {
  test('empty', async () => {
    // Arrange
    const client = createTestClient()
    server.use(
      http.get(baseUrl, () => HttpResponse.json({ data: [], hasMore: false }), { once: true }),
    )

    // Act
    const pageResults = await client.getPages()

    // Assert
    expect(pageResults).toEqual({
      data: [],
      hasMore: false,
    })
  })

  test('throws on unexpected data', async () => {
    // Arrange
    const client = createTestClient()

    server.use(
      http.get(baseUrl, () => HttpResponse.json({ data: { test: 'test' }, hasMore: false }), {
        once: true,
      }),
    )

    // Act
    const getPagesPromise = client.getPages()

    // Assert
    expect(getPagesPromise).rejects.toThrow("Failed to parse 'getPages' response")
  })

  test('can get many pages', async () => {
    // Arrange
    const client = createTestClient()
    const mockPages = Array.from({ length: 10 }, createRandomPageV4)
    server.use(
      http.get(baseUrl, () => HttpResponse.json({ data: mockPages, hasMore: false }), {
        once: true,
      }),
    )

    // Act
    const pageResults = await client.getPages()

    // Assert
    expect(pageResults).toEqual({
      data: mockPages,
      hasMore: false,
    })
  })

  test('toArray gets all pages', async () => {
    // Arrange
    const client = createTestClient()
    const [page1, page2, page3] = Array.from({ length: 3 }, createRandomPageV4)
    server.use(
      http.get(baseUrl, () => HttpResponse.json({ data: [page1], hasMore: true }), { once: true }),
      http.get(baseUrl, () => HttpResponse.json({ data: [page2], hasMore: true }), { once: true }),
      http.get(baseUrl, () => HttpResponse.json({ data: [page3], hasMore: false }), { once: true }),
    )

    // Act
    const pageResults = await client.getPages().toArray()
    expect(pageResults).toHaveLength(3)
    expect(pageResults).toEqual([page1, page2, page3])
    expect(server.listHandlers().every(handler => handler.isUsed)).toBe(true)
  })

  test('async iterable gets all pages', async () => {
    // Arrange
    const client = createTestClient()
    const [page1, page2, page3] = Array.from({ length: 3 }, createRandomPageV4)
    server.use(
      http.get(baseUrl, () => HttpResponse.json({ data: [page1], hasMore: true }), { once: true }),
      http.get(baseUrl, () => HttpResponse.json({ data: [page2], hasMore: true }), { once: true }),
      http.get(baseUrl, () => HttpResponse.json({ data: [page3], hasMore: false }), { once: true }),
    )

    // Act
    const pageResults = []
    for await (const page of client.getPages()) {
      pageResults.push(page)
    }

    expect(pageResults).toHaveLength(3)
    expect(pageResults).toEqual([page1, page2, page3])
    expect(server.listHandlers().every(handler => handler.isUsed)).toBe(true)
  })

  test('async iterable methods are chainable', async () => {
    // Arrange
    const client = createTestClient()
    const [page1, page2, page3] = Array.from({ length: 3 }, createRandomPageV4)
    server.use(
      http.get(baseUrl, () => HttpResponse.json({ data: [page1, page2, page3], hasMore: false }), {
        once: true,
      }),
    )

    // Act
    const mappedAndFilteredPages = await client
      .getPages()
      .map(page => page.id)
      .filter(id => id === page1.id)
      .toArray()

    //Assert
    expect(mappedAndFilteredPages).toEqual([page1.id])
  })
})
