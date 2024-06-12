import { Makeswift } from '../client'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { randomUUID } from 'crypto'

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
const apiOrigin = 'https://api.fakeswift.com'
const baseUrl = `${apiOrigin}/v4/pages`

const handlers = [
  http.get(baseUrl, () => HttpResponse.json({ data: [], hasMore: false }), { once: true }),
]

const server = setupServer(...handlers)

beforeAll(() => {
  server.resetHandlers()
  server.listen()
})

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => server.close())

describe('getPages v4', () => {
  test('empty', async () => {
    // Arrange
    const client = new Makeswift(TEST_API_KEY, { apiOrigin })

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
    const client = new Makeswift(TEST_API_KEY, { apiOrigin })

    server.use(
      http.get(baseUrl, () => HttpResponse.json({ data: { test: 'test' }, hasMore: false }), {
        once: true,
      }),
    )

    // Act
    const getPagesPromise = client.getPages()

    // Assert
    expect(getPagesPromise).rejects.toThrow('Failed to parse getPages response')
  })

  test('can get many pages', async () => {
    // Arrange
    const client = new Makeswift(TEST_API_KEY, { apiOrigin })
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
    const client = new Makeswift(TEST_API_KEY, { apiOrigin })
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
    const client = new Makeswift(TEST_API_KEY, { apiOrigin })
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
    const client = new Makeswift(TEST_API_KEY, { apiOrigin })
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
