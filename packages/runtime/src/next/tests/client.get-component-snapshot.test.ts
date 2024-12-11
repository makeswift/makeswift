import { Makeswift, MakeswiftComponentDocumentSchemaV2 } from '../client'
import { http, HttpResponse, graphql } from 'msw'

import { server } from '../../mocks/server'
import { MakeswiftSiteVersion } from '../preview-mode'
import { ZodError } from 'zod'

const TEST_API_KEY = 'xxx'
const apiOrigin = 'https://api.fakeswift.com'
const baseUrl = `${apiOrigin}/v2/element-trees`

describe('getComponentSnapshot using v2 element tree endpoint', () => {
    test('return fallback document on 404', async () => {
        // Arrange
        const client = new Makeswift(TEST_API_KEY, { apiOrigin })
        const treeId = 'myTree'
        server.use(
            http.get(`${baseUrl}/${treeId}`, () => HttpResponse.text('', { status: 404 }),{ once: true })
        )

        // Act
        const result = await client.getComponentSnapshot(treeId, { siteVersion: MakeswiftSiteVersion.Working })

        // Assert
        expect(result.document).not.toBeNull()
        expect(result.document.id).toBe(treeId)
        expect(result.document.data).toBeNull()
        expect(result.cacheData).not.toBeNull()
        expect(result.cacheData.apiResources).toStrictEqual({})
        expect(result.cacheData.localizedResourcesMap).toStrictEqual({})
    })

    test('throws if response is 200 but element tree results are null', async () => {
        // Arrange
        const client = new Makeswift(TEST_API_KEY, { apiOrigin })
        const treeId = 'myTree'
        server.use(
            http.get(`${baseUrl}/${treeId}`, () => HttpResponse.json({ elementTree: null, parentLocaleElementTree: null}, { status: 200}), { once: true})
        )

        // Act
        const getResult = async () => {
            return client.getComponentSnapshot(treeId, { siteVersion: MakeswiftSiteVersion.Working })
        }

        // Assert
        expect(getResult).rejects.toThrow(ZodError)
    })

    test('throws on unexpected format for element tree', async () => {
        // Arrange
        const client = new Makeswift(TEST_API_KEY, { apiOrigin })
        const treeId = 'myTree'
        server.use(
            http.get(`${baseUrl}/${treeId}`, () => HttpResponse.json({ elementTree: {}, parentLocaleElementTree: null}, { status: 200}), { once: true })
        )

        // Act
        const getResult = async () => {
            return client.getComponentSnapshot(treeId, { siteVersion: MakeswiftSiteVersion.Working })
        }

        // Assert
        expect(getResult).rejects.toThrow(ZodError)
    })

    test('favors returning elementTree over parentLocaleElementTree if both are present', async () => {
        // Arrange
        const client = new Makeswift(TEST_API_KEY, { apiOrigin })

        // These fields don't need to correspond to any existing resource for the test - they are just being used to form a valid MakeswiftComponentDocumentSchemaV2 object
        const treeId = 'myTree123'
        const elementTreeName = 'myElementTree'
        const elementTreeKey = "abc123"

        const elementTree: MakeswiftComponentDocumentSchemaV2 = {
            id: treeId,
            type: './components/Box/index.js',
            name: elementTreeName,
            data: {
                type: './components/Box/index.js',
                key: elementTreeKey,
                props: {}
            },
            locale: 'fr-FR',
            siteId: 'mySiteId'
        }

        const parentLocaleElementTree: MakeswiftComponentDocumentSchemaV2 = {
            id: treeId,
            type: './components/Box/index.js',
            name: 'parentLocaleElementTreeName',
            data: {
                type: './components/Box/index.js',
                key: 'def123',
                props: {}
            },
            locale: 'en-US',
            siteId: 'mySiteId'
        }

        const testResponse = {
            elementTree,
            parentLocaleElementTree
        }

        server.use(
            http.get(`${baseUrl}/${treeId}`, () => HttpResponse.json(testResponse, { status: 200}), { once: true }),
            graphql.operation(() => {
                return HttpResponse.json({})
            })
        )

        // Act
        const result = await client.getComponentSnapshot(treeId, { siteVersion: MakeswiftSiteVersion.Working })

        // Assert
        expect(result).not.toBeNull()
        expect(result.document).not.toBeNull()
        expect(result.document.data).not.toBeNull()
        expect(result.document.data?.key).toBe(elementTreeKey)
    })

    test('returns parentLocaleElementTree when elementTree is not present', async () => {
        // Arrange
        const client = new Makeswift(TEST_API_KEY, { apiOrigin })

        // These fields don't need to correspond to any existing resource for the test - they are just being used to form a valid MakeswiftComponentDocumentSchemaV2 object
        const treeId = 'myTree123'
        const parentLocaleElementTreeName = 'myElementTree'
        const elementTreeKey = 'def123'

        const parentLocaleElementTree: MakeswiftComponentDocumentSchemaV2 = {
            id: treeId,
            type: './components/Box/index.js',
            name: parentLocaleElementTreeName,
            data: {
                type: './components/Box/index.js',
                key: elementTreeKey,
                props: {}
            },
            locale: 'en-US',
            siteId: 'mySiteId'
        }

        const testResponse = {
            elementTree: null,
            parentLocaleElementTree
        }

        server.use(
            http.get(`${baseUrl}/${treeId}`, () => HttpResponse.json(testResponse, { status: 200 }), { once: true }),
            graphql.operation(() => {
                return HttpResponse.json({})
            })
        )

        // Act
        const result = await client.getComponentSnapshot(treeId, { siteVersion: MakeswiftSiteVersion.Working })

        // Assert
        expect(result).not.toBeNull()
        expect(result.document).not.toBeNull()
        expect(result.document.data).not.toBeNull()
        expect(result.document.data?.key).toBe(elementTreeKey)
    })
})
