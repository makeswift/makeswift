import { createResponse } from 'node-mocks-http'
import { randomUUID } from 'crypto'
import * as nextCache from 'next/cache'

import { MakeswiftApiHandler } from '../api-handler'
import { NextApiResponse } from 'next'
import { ReactRuntime } from '../../react'
import {
  createNextApiRequest,
  createNextRequestWithContext,
  type RequestParams,
} from './test-utils'

const apiKey = 'fake-api-key'

type MakeswiftApiHandlerArgs = Partial<Parameters<typeof MakeswiftApiHandler>[1]>

function createHandler(args: Partial<MakeswiftApiHandlerArgs> = {}) {
  const runtime = new ReactRuntime()
  return MakeswiftApiHandler(apiKey, {
    ...args,
    runtime,
    apiOrigin: 'https://api.fakeswift.com',
    appOrigin: 'https://app.fakeswift.com',
  })
}

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}))

afterEach(() => {
  jest.restoreAllMocks()
})

describe('MakeswiftApiHandler', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  function pagesRouterRevalidateFixture(args: MakeswiftApiHandlerArgs = {}) {
    function revalidateResponse({ revalidate }: { revalidate: (path: string) => Promise<void> }) {
      const response = createResponse<NextApiResponse>()
      response.revalidate = revalidate
      return response
    }

    const handler = createHandler(args)
    const revalidate = jest.fn()
    const response = revalidateResponse({ revalidate })
    const testApiRequest = async (reqParams: RequestParams) => {
      await handler(createNextApiRequest(reqParams), response)
      return response.statusCode
    }

    return { testApiRequest, revalidate }
  }

  function appRouterRevalidateFixture(args: MakeswiftApiHandlerArgs = {}) {
    const handler = createHandler(args)
    const testApiRequest = async (reqParams: RequestParams) => {
      const response = await handler(...createNextRequestWithContext(reqParams))
      return response?.status
    }

    return { testApiRequest, revalidate: nextCache.revalidatePath }
  }

  describe.each([
    { fixture: pagesRouterRevalidateFixture, router: 'pages' },
    { fixture: appRouterRevalidateFixture, router: 'app' },
  ])('[$router router] /api/makeswift/revalidate', ({ fixture }) => {
    test('401s and does not call revalidate when no secret is provided', async () => {
      // Arrange
      const { testApiRequest, revalidate } = fixture()

      // Act
      const statusCode = await testApiRequest({ method: 'GET', path: '/makeswift/revalidate' })

      // Assert
      expect(statusCode).toBe(401)
      expect(revalidate).not.toHaveBeenCalled()
    })

    test('400s and does not call revalidate when no path is provided', async () => {
      // Arrange
      const { testApiRequest, revalidate } = fixture()

      // Act
      const statusCode = await testApiRequest({
        method: 'GET',
        path: `/makeswift/revalidate?secret=${apiKey}`,
      })

      // Assert
      expect(statusCode).toBe(400)
      expect(revalidate).not.toHaveBeenCalled()
    })

    test('200s and calls revalidate when revalidating a path', async () => {
      // Arrange
      const { testApiRequest, revalidate } = fixture()

      // Act
      const statusCode = await testApiRequest({
        method: 'GET',
        path: `/makeswift/revalidate?secret=${apiKey}&path=/some-path`,
      })

      // Assert
      expect(statusCode).toBe(200)
      expect(revalidate).toHaveBeenCalledWith('/some-path')
    })
  })

  function pagesRouterWebhookFixture(args: MakeswiftApiHandlerArgs = {}) {
    const handler = createHandler(args)

    const response = createResponse<NextApiResponse>()
    const testApiRequest = async (reqParams: RequestParams) => {
      await handler(createNextApiRequest(reqParams), response)
      return { statusCode: response.statusCode, jsonBody: response._getJSONData() }
    }

    return { testApiRequest }
  }

  function appRouterWebhookFixture(args: MakeswiftApiHandlerArgs = {}) {
    const handler = createHandler(args)
    const testApiRequest = async (reqParams: RequestParams) => {
      const response = await handler(...createNextRequestWithContext(reqParams))
      return { statusCode: response?.status, jsonBody: await response?.json() }
    }

    return { testApiRequest, revalidate: nextCache.revalidatePath }
  }

  describe.each([
    { fixture: pagesRouterWebhookFixture, router: 'pages' },
    { fixture: appRouterWebhookFixture, router: 'app' },
  ])('[$router router] /api/makeswift/webhook', ({ fixture, router }) => {
    const webhookPayload = {
      type: 'site.published',
      data: {
        siteId: randomUUID(),
        publish: {
          from: null,
          to: randomUUID(),
        },
        at: 1234567890,
      },
    }

    test('401s and does not call revalidateTag when no secret is provided', async () => {
      // Arrange
      const { testApiRequest } = fixture()

      // Act
      const { statusCode, jsonBody } = await testApiRequest({
        method: 'POST',
        path: '/makeswift/webhook',
        body: webhookPayload,
      })

      // Assert
      expect(statusCode).toBe(401)
      expect(jsonBody).toEqual({ message: 'Unauthorized' })
      expect(nextCache.revalidateTag).not.toHaveBeenCalled()
    })

    test('400s and does not call revalidateTag when payload is invalid', async () => {
      // Arrange
      const { testApiRequest } = fixture()

      // Act
      const { statusCode, jsonBody } = await testApiRequest({
        method: 'POST',
        path: `/makeswift/webhook?secret=${apiKey}`,
        body: { type: 'invalid.type' },
      })

      // Assert
      expect(statusCode).toBe(400)
      expect(jsonBody).toEqual({ message: 'Invalid request body' })
      expect(nextCache.revalidateTag).not.toHaveBeenCalled()

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Invalid literal value'),
        }),
      )
    })

    test('200s and calls user-provided onPublish callback', async () => {
      // Arrange
      const onPublish = jest.fn()
      const { testApiRequest } = fixture({ events: { onPublish } })

      // Act
      const { statusCode } = await testApiRequest({
        method: 'POST',
        path: `/makeswift/webhook?secret=${apiKey}`,
        body: webhookPayload,
      })

      // Assert
      expect(statusCode).toBe(200)
      expect(onPublish).toHaveBeenCalled()
    })

    test('200s and calls revalidateTag when user-provided onPublish callback fails', async () => {
      // Arrange
      const onPublish = jest.fn(() => {
        throw new Error('Failed in user-provided onPublish')
      })
      const { testApiRequest } = fixture({ events: { onPublish } })

      // Act
      const { statusCode } = await testApiRequest({
        method: 'POST',
        path: `/makeswift/webhook?secret=${apiKey}`,
        body: webhookPayload,
      })

      // Assert
      expect(statusCode).toBe(200)
      if (router === 'app') {
        expect(nextCache.revalidateTag).toHaveBeenCalledWith('@@makeswift')
      } else {
        expect(nextCache.revalidateTag).not.toHaveBeenCalled()
      }

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Unhandled exception in the 'onPublish' callback:",
        expect.objectContaining({
          message: 'Failed in user-provided onPublish',
        }),
      )
    })
  })
})
