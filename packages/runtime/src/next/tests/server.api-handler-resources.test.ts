import { type APIResource, type LocalizedGlobalElement } from '../../api'

import { apiRequestFixtures } from './test-utils'
import * as makeswiftClient from '../client'
import { ApiHandlerHeaders, serializeSiteVersion } from '../../api/site-version'

import * as fixtures from './__fixtures__/resources'

let consoleErrorSpy: jest.SpyInstance

jest.mock('../client', () => ({
  Makeswift: jest.fn(),
}))

const TestWorkingSiteVersion = {
  version: 'ref:working',
  token: 'test-preview-token',
}

const isEmptyQuery = (query: Record<string, any> | undefined) =>
  Object.entries(query ?? {}).filter(([_, v]) => v != null).length === 0

const resourceGetter =
  <T extends APIResource>(resource: T) =>
  (id: string, version?: string, query?: Record<string, any>) =>
    Promise.resolve(
      id === resource.id
        ? {
            ...resource,
            __meta: {
              version,
              ...(isEmptyQuery(query) ? {} : { query }),
            },
          }
        : null,
    )

const localizedResourceGetter =
  <T extends LocalizedGlobalElement>(resource: T) =>
  (id: string, locale: string, version: string | undefined) =>
    Promise.resolve(id === resource.id ? { ...resource, __meta: { locale, version } } : null)

beforeEach(() => {
  jest.mocked(makeswiftClient.Makeswift).mockReturnValue({
    getSwatch: jest.fn(resourceGetter(fixtures.swatch)),
    getFile: jest.fn(resourceGetter(fixtures.file)),
    getTypography: jest.fn(resourceGetter(fixtures.typography)),
    getGlobalElement: jest.fn(resourceGetter(fixtures.globalElement)),
    getLocalizedGlobalElement: jest.fn(localizedResourceGetter(fixtures.localizedGlobalElement)),
    getPagePathnameSlice: jest.fn(resourceGetter(fixtures.pagePathnameSlice)),
    getTable: jest.fn(resourceGetter(fixtures.table)),
  } as any)

  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  jest.resetAllMocks()
  consoleErrorSpy.mockRestore()
})

describe('MakeswiftApiHandler', () => {
  describe.each(apiRequestFixtures)('[$router router]', ({ fixture }) => {
    describe.each([
      { resource: 'swatches', id: fixtures.swatch.id },
      { resource: 'files', id: fixtures.file.id, versioned: false },
      { resource: 'typographies', id: fixtures.typography.id },
      { resource: 'global-elements', id: fixtures.globalElement.id },
      {
        resource: 'localized-global-elements',
        id: fixtures.localizedGlobalElement.id,
        locale: 'fr-FR',
      },
      { resource: 'page-pathname-slices', id: fixtures.pagePathnameSlice.id },
      {
        resource: 'page-pathname-slices',
        id: fixtures.pagePathnameSlice.id,
        query: { locale: 'es-MX' },
      },
      { resource: 'tables', id: fixtures.table.id, versioned: false },
    ])('/api/makeswift/$resource', ({ resource, id, locale, query, versioned = true }) => {
      const getEndpoint = (id: string | null) =>
        `/api/makeswift/${resource}/${id}${locale ? `/${locale}` : ''}` +
        `${query ? `?${new URLSearchParams(query).toString()}` : ''}`

      describe.each(versioned ? [TestWorkingSiteVersion.version] : [''])('%s', () => {
        const headers = versioned
          ? {
              [ApiHandlerHeaders.SiteVersion]: serializeSiteVersion(TestWorkingSiteVersion),
            }
          : undefined

        describe(query ? `with ${new URLSearchParams(query).toString()}` : '', () => {
          test('does not require authentication', async () => {
            // Arrange
            const { testApiRequest } = fixture()

            // Act
            const { statusCode } = await testApiRequest({
              method: 'GET',
              path: getEndpoint(id),
              headers,
            })

            // Assert
            expect(statusCode).toBe(200)
          })

          test.each([{ id: null }, { id: '[non-existing-id]' }])(
            'returns 404 when resource is not found (id=$id)',
            async ({ id }) => {
              // Arrange
              const { testApiRequest } = fixture()

              // Act
              const { statusCode, jsonBody } = await testApiRequest({
                method: 'GET',
                path: getEndpoint(id),
                headers,
              })

              // Assert
              expect(statusCode).toBe(404)
              expect(await jsonBody).toEqual({ message: 'Not Found' })
            },
          )

          test('returns resource data when resource is found', async () => {
            // Arrange
            const { testApiRequest } = fixture()

            // Act
            const { statusCode, jsonBody } = await testApiRequest({
              method: 'GET',
              path: getEndpoint(id),
              headers,
            })

            // Assert
            expect(statusCode).toBe(200)
            expect(await jsonBody).toEqual(
              expect.objectContaining({
                id,
                __meta: {
                  ...(versioned ? { version: { ...TestWorkingSiteVersion } } : {}),
                  ...(query ? { query } : {}),
                  ...(locale ? { locale } : {}),
                },
              }),
            )
          })
        })
      })

      if (versioned) {
        test('returns data associated with empty site version when invalid site version is provided', async () => {
          // Arrange
          const { testApiRequest } = fixture()

          // Act
          const { statusCode, jsonBody } = await testApiRequest({
            method: 'GET',
            path: getEndpoint(id),
            headers: { [ApiHandlerHeaders.SiteVersion]: 'invalid-version' },
          })

          // Assert
          expect(statusCode).toBe(200)
          expect(await jsonBody).toEqual(
            expect.objectContaining({
              id,
              __meta: {
                version: null,
                ...(query ? { query } : {}),
                ...(locale ? { locale } : {}),
              },
            }),
          )
          expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Failed to parse serialized site version:',
            'invalid-version',
          )
        })
      }
    })
  })
})
