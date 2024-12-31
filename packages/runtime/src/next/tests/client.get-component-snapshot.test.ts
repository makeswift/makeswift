import { Makeswift, MakeswiftComponentDocument } from '../client'
import { http, HttpResponse, graphql } from 'msw'

import { server } from '../../mocks/server'
import { MakeswiftSiteVersion } from '../preview-mode'
import { ZodError } from 'zod'

const TEST_API_KEY = 'myApiKey'
const apiOrigin = 'https://api.fakeswift.com'
const baseUrl = `${apiOrigin}/v1/element-trees`

describe('getComponentSnapshot using v1 element tree endpoint', () => {
  test('return fallback document on 404', async () => {
    // Arrange
    const client = new Makeswift(TEST_API_KEY, { apiOrigin })
    const treeId = 'myTree'
    server.use(
      http.get(`${baseUrl}/${treeId}`, () => HttpResponse.text('', { status: 404 }), {
        once: true,
      }),
    )

    // Act
    const result = await client.getComponentSnapshot(treeId, {
      siteVersion: MakeswiftSiteVersion.Working,
    })

    // Assert
    expect(result.document).not.toBeNull()
    expect(result.document.id).toBe(treeId)
    expect(result.document.data).toBeNull()
    expect(result.cacheData).not.toBeNull()
    expect(result.cacheData.apiResources).toStrictEqual({})
    expect(result.cacheData.localizedResourcesMap).toStrictEqual({})
  })

  test('throws if response is 200 but element tree result is null', async () => {
    // Arrange
    const client = new Makeswift(TEST_API_KEY, { apiOrigin })
    const treeId = 'myTree'
    const responseWithInvalidFormat = {
      id: 'someTreeId',
      name: 'someTreeName',
      locale: null,
      data: {},
      type: null,
      siteId: null,
    }
    server.use(
      http.get(
        `${baseUrl}/${treeId}`,
        () => HttpResponse.json(responseWithInvalidFormat, { status: 200 }),
        { once: true },
      ),
    )

    // Act
    const getResult = async () => {
      return client.getComponentSnapshot(treeId, { siteVersion: MakeswiftSiteVersion.Working })
    }

    // Assert
    expect(getResult).rejects.toThrow(ZodError)
  })

  test('successfully performs locale fallback by requesting base locale tree after receiving a 404 response for a locale variant tree', async () => {
    // Arrange
    const client = new Makeswift(TEST_API_KEY, { apiOrigin })
    const localeToTest = 'fr-FR'
    const baseLocale = null

    // mock base locale tree document
    const treeId = 'myTree123'
    const elementTreeName = 'myElementTree'
    const elementTreeKey = 'abc123'
    const document: MakeswiftComponentDocument = {
      id: treeId,
      name: elementTreeName,
      data: {
        type: 'myType',
        key: elementTreeKey,
        props: {},
      },
      locale: baseLocale,
      siteId: 'mySiteId',
    }

    /*
        Intercept:
        (1) initial request to v1 endpoint for the locale variant tree
        (2) subsequent request to v1 endpoint for the base locale tree
            - this is the step that we're really testing here - we want the logic in getComponentSnapshot to execute this subsequent request
        (3) graphql query for introspection
    */
    server.use(
      http.get(
        `${baseUrl}/${treeId}?locale=${localeToTest}`,
        () => HttpResponse.text('', { status: 404 }),
        { once: true },
      ),
      http.get(`${baseUrl}/${treeId}`, () => HttpResponse.json(document, { status: 200 }), {
        once: true,
      }),
      graphql.operation(() => {
        return HttpResponse.json({})
      }),
    )

    // Act
    const result = await client.getComponentSnapshot(treeId, {
      siteVersion: MakeswiftSiteVersion.Working,
      locale: localeToTest,
    })

    // Assert
    expect(result).not.toBeNull()
    expect(result.document).not.toBeNull()
    expect(result.document.data).not.toBeNull()
    expect(result.document.data?.key).toBe(elementTreeKey)
    expect(result.document.locale).toBe(baseLocale)
  }),
    test('does not perform locale fallback after receiving a 404 response for a locale variant tree, when allowFallback is false', async () => {
      // Arrange
      const client = new Makeswift(TEST_API_KEY, { apiOrigin })
      const localeToTest = 'fr-FR'
      const baseLocale = null

      // mock base locale tree document
      const treeId = 'myTree123'
      const elementTreeName = 'myElementTree'
      const elementTreeKey = 'abc123'
      const document: MakeswiftComponentDocument = {
        id: treeId,
        name: elementTreeName,
        data: {
          type: 'myType',
          key: elementTreeKey,
          props: {},
        },
        locale: baseLocale,
        siteId: 'mySiteId',
      }

      /*
        Intercept:
        (1) initial request to v1 endpoint for the locale variant tree
        (2) subsequent request to v1 endpoint for the base locale tree
            - should not execute for this test
        (3) graphql query for introspection
      */
      server.use(
        http.get(
          `${baseUrl}/${treeId}?locale=${localeToTest}`,
          () => HttpResponse.text('', { status: 404 }),
          { once: true },
        ),
        http.get(`${baseUrl}/${treeId}`, () => HttpResponse.json(document, { status: 200 }), {
          once: true,
        }),
        graphql.operation(() => {
          return HttpResponse.json({})
        }),
      )

      // Act
      const result = await client.getComponentSnapshot(treeId, {
        siteVersion: MakeswiftSiteVersion.Working,
        locale: localeToTest,
        allowLocaleFallback: false,
      })

      // Assert
      expect(result).not.toBeNull()
      expect(result.document).not.toBeNull()
      expect(result.document.id).toBe(treeId)
      expect(result.document.data).toBeNull()
      expect(result.document.locale).toBe(localeToTest)
    }),
    test('does not perform locale fallback after receiving a 200 response for the requested locale variant tree', async () => {
      // Arrange
      const client = new Makeswift(TEST_API_KEY, { apiOrigin })
      const localeToTest = 'fr-FR'

      // mock locale variant tree document
      const treeId = 'myTree123'
      const elementTreeName = 'myElementTree'
      const elementTreeKey = 'abc123'
      const document: MakeswiftComponentDocument = {
        id: treeId,
        name: elementTreeName,
        data: {
          type: 'myType',
          key: elementTreeKey,
          props: {},
        },
        locale: localeToTest,
        siteId: 'mySiteId',
      }

      /*
        Intercept:
        (1) initial request to v1 endpoint for the locale variant tree
        (2) subsequent request to v1 endpoint for the base locale tree
            - should not happen for this test
        (3) graphql query for introspection
      */
      server.use(
        http.get(
          `${baseUrl}/${treeId}?locale=${localeToTest}`,
          () => HttpResponse.json(document, { status: 200 }),
          { once: true },
        ),
        http.get(`${baseUrl}/${treeId}`, () => HttpResponse.text('', { status: 404 }), {
          once: true,
        }),
        graphql.operation(() => {
          return HttpResponse.json({})
        }),
      )

      // Act
      const result = await client.getComponentSnapshot(treeId, {
        siteVersion: MakeswiftSiteVersion.Working,
        locale: localeToTest,
      })

      // Assert
      expect(result).not.toBeNull()
      expect(result.document).not.toBeNull()
      expect(result.document.id).toBe(treeId)
      expect(result.document.locale).toBe(localeToTest)
      expect(result.document.data).not.toBeNull()
    })
})
