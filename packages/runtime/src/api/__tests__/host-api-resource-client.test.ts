import { getLocalizedResourceId } from '../../state/api-client/state'
import { HostApiResourcesClient } from '../host-api-resources-client'
import { http, HttpResponse } from 'msw'

import { server } from '../../mocks/server'
import { TestWorkingSiteVersion, TestOrigins } from '../../testing/fixtures'
import {
  makeSwatch,
  makeFile,
  makeTypography,
  makeGlobalElement,
  makeLocalizedGlobalElement,
  makePagePathnameSlice,
  makeTable,
} from '../../testing/fixtures/resources'

import { type SiteVersion, ApiHandlerHeaders, deserializeSiteVersion } from '../site-version'
import { APIResource } from '../types'

const { apiOrigin } = TestOrigins
const baseUrl = `${apiOrigin}/api/makeswift`

function createTestClient({
  siteVersion,
  locale,
}: {
  siteVersion?: SiteVersion | null
  locale?: string
} = {}) {
  return new HostApiResourcesClient({
    fetch: (url, init) => globalThis.fetch(`${apiOrigin}${url}`, init),
    preloadedState: {
      siteVersion: siteVersion === undefined ? TestWorkingSiteVersion : siteVersion,
      locale,
    },
  })
}

const searchParams = (req: Request) => new URL(req.url).searchParams

let consoleErrorSpy: jest.SpyInstance

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  consoleErrorSpy.mockRestore()
})

type TestCase = {
  name: string
  resource: APIResource
  makeUrl: (id: string) => string
  readResource: (client: HostApiResourcesClient, id: string, locale?: string) => APIResource | null
  fetchResource: (client: HostApiResourcesClient, id: string) => Promise<APIResource | null>
}

describe.each<TestCase>([
  {
    name: 'swatches',
    resource: makeSwatch('mySwatch'),
    makeUrl: id => `${baseUrl}/swatches/${id}`,
    readResource: (client, id) => client.readSwatch(id),
    fetchResource: (client, id) => client.fetchSwatch(id),
  },
  {
    name: 'files',
    resource: makeFile('myFile'),
    makeUrl: id => `${baseUrl}/files/${id}`,
    readResource: (client, id) => client.readFile(id),
    fetchResource: (client, id) => client.fetchFile(id),
  },
  {
    name: 'global elements',
    resource: makeGlobalElement('myGlobalElement'),
    makeUrl: id => `${baseUrl}/global-elements/${id}`,
    readResource: (client, id) => client.readGlobalElement(id),
    fetchResource: (client, id) => client.fetchGlobalElement(id),
  },
  {
    name: 'localized global elements',
    resource: makeLocalizedGlobalElement('myLocalizedGlobalElement'),
    makeUrl: id => `${baseUrl}/localized-global-elements/${id}/es-MX`,
    readResource: (client, globalElementId) =>
      client.readLocalizedGlobalElement({ globalElementId, locale: 'es-MX' }),
    fetchResource: (client, globalElementId) =>
      client.fetchLocalizedGlobalElement({ globalElementId, locale: 'es-MX' }),
  },
  {
    name: 'typographies',
    resource: makeTypography('myTypography'),
    makeUrl: id => `${baseUrl}/typographies/${id}`,
    readResource: (client, id) => client.readTypography(id),
    fetchResource: (client, id) => client.fetchTypography(id),
  },
  {
    name: 'page pathnames',
    resource: makePagePathnameSlice('myPathnameSlice'),
    makeUrl: id => `${baseUrl}/page-pathname-slices/${id}`,
    readResource: (client, pageId) => client.readPagePathnameSlice({ pageId, locale: null }),
    fetchResource: (client, pageId) => client.fetchPagePathnameSlice({ pageId, locale: null }),
  },
  {
    name: 'tables',
    resource: makeTable('myTable'),
    makeUrl: id => `${baseUrl}/tables/${id}`,
    readResource: (client, id) => client.readTable(id),
    fetchResource: (client, id) => client.fetchTable(id),
  },
])('$name', ({ resource, makeUrl, readResource, fetchResource }) => {
  const resourceUrl = makeUrl(resource.id)

  test('returns null on first read, retrieves from cache after fetch', async () => {
    // Arrange
    const client = createTestClient()
    const httpGet = jest.fn(r => r)

    server.use(http.get(resourceUrl, () => httpGet(HttpResponse.json(resource))))

    // Act & Assert
    const firstRead = readResource(client, resource.id)
    expect(firstRead).toBeNull()
    expect(httpGet).not.toHaveBeenCalled()

    const fetchResult = await fetchResource(client, resource.id)
    expect(fetchResult).toEqual(resource)
    expect(httpGet).toHaveBeenCalledTimes(1)

    const secondRead = readResource(client, resource.id)
    expect(secondRead).toEqual(resource)
    expect(httpGet).toHaveBeenCalledTimes(1)

    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('fetch returns null on 404', async () => {
    // Arrange
    const client = createTestClient()
    const httpGet = jest.fn(r => r)

    server.use(
      http.get(resourceUrl, () => httpGet(HttpResponse.text('', { status: 404 })), {
        once: true,
      }),
    )

    // Act
    const result = await fetchResource(client, resource.id)

    // Assert
    expect(result).toBeNull()
    expect(httpGet).toHaveBeenCalledTimes(1)
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('fetch include site version header', async () => {
    // Arrange
    const client = createTestClient()
    const httpRequest = jest.fn()

    server.use(
      http.get(resourceUrl, ({ request }) => (httpRequest(request), HttpResponse.json(resource))),
    )

    // Act
    await fetchResource(client, resource.id)

    // Assert
    expect(httpRequest).toHaveBeenCalledTimes(1)

    const request = httpRequest.mock.calls[0][0] as Request
    expect(
      deserializeSiteVersion(request.headers.get(ApiHandlerHeaders.SiteVersion) ?? ''),
    ).toEqual(TestWorkingSiteVersion)
  })
})

describe('localized global elements', () => {
  const globalElementId = 'myGlobalElement'
  const locale = 'es-MX'
  const resource = makeLocalizedGlobalElement('myLocalizedGlobalElement')
  const resourceUrl = (locale: string) =>
    `${baseUrl}/localized-global-elements/${globalElementId}/${locale}`

  test('reads and fetches are partitioned by locale', async () => {
    // Arrange
    const client = createTestClient()
    const httpGet = jest.fn(r => r)
    const resource1 = makeLocalizedGlobalElement('myLocalizedGlobalElement1')
    const resource2 = makeLocalizedGlobalElement('myLocalizedGlobalElement2')
    const altLocale = 'fr'

    server.use(http.get(resourceUrl(locale), () => httpGet(HttpResponse.json(resource1))))
    server.use(http.get(resourceUrl(altLocale), () => httpGet(HttpResponse.json(resource2))))

    // Act & Assert
    const result1 = await client.fetchLocalizedGlobalElement({ globalElementId, locale })
    expect(result1).toEqual(resource1)
    expect(httpGet).toHaveBeenCalledTimes(1)

    expect(client.readLocalizedGlobalElement({ globalElementId, locale: altLocale })).toBe(null)
    const result2 = await client.fetchLocalizedGlobalElement({
      globalElementId,
      locale: altLocale,
    })

    expect(result2).toEqual(resource2)
    expect(httpGet).toHaveBeenCalledTimes(2)
  })

  test('consequent fetches of missing element are cached', async () => {
    // Arrange
    const client = createTestClient()
    const httpGet = jest.fn(r => r)

    server.use(http.get(resourceUrl(locale), () => httpGet(HttpResponse.text('', { status: 404 }))))

    // Act & Assert
    const firstFetch = await client.fetchLocalizedGlobalElement({ globalElementId, locale })

    expect(firstFetch).toBe(null)
    expect(httpGet).toHaveBeenCalledTimes(1)

    const secondFetch = await client.fetchLocalizedGlobalElement({ globalElementId, locale })

    expect(secondFetch).toBe(null)
    expect(httpGet).toHaveBeenCalledTimes(1)
  })

  test('fetching existing localized element sets localized resource ID', async () => {
    // Arrange
    const client = createTestClient()
    const httpGet = jest.fn(r => r)
    const localizedResourceId = () =>
      getLocalizedResourceId(client.store.getState(), locale, globalElementId)

    server.use(http.get(resourceUrl(locale), () => httpGet(HttpResponse.json(resource))))

    // Act & Assert
    expect(localizedResourceId()).toBe(undefined)

    const result = await client.fetchLocalizedGlobalElement({ globalElementId, locale })

    expect(result).toEqual(resource)
    expect(httpGet).toHaveBeenCalledTimes(1)
    expect(localizedResourceId()).toBe(resource.id)
  })
})

describe('page pathnames', () => {
  const resource = makePagePathnameSlice('myPagePathname')
  const resourceUrl = `${baseUrl}/page-pathname-slices/${resource.id}`
  const locale = 'es-MX'

  test('fetches localized pathname when non-null locale is provided', async () => {
    // Arrange
    const client = createTestClient()
    const httpRequest = jest.fn()

    server.use(
      http.get(resourceUrl, ({ request }) => (httpRequest(request), HttpResponse.json(resource))),
    )

    // Act
    await client.fetchPagePathnameSlice({ pageId: resource.id, locale })

    // Assert
    expect(httpRequest).toHaveBeenCalledTimes(1)

    const request = httpRequest.mock.calls[0][0] as Request
    expect(searchParams(request).get('locale')).toEqual(locale)
  })
})
