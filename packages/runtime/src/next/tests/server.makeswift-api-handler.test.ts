import { createResponse } from 'node-mocks-http'
import { randomUUID } from 'crypto'
import * as nextCache from 'next/cache'

import { MakeswiftApiHandler } from '../api-handler'
import { NextApiResponse } from 'next'
import { ReactRuntime } from '../../react'
import { createNextApiRequest } from './test-utils'

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

  describe('/api/makeswift/revalidate', () => {
    function revalidateResponse({ revalidate }: { revalidate: (path: string) => Promise<void> }) {
      const response = createResponse<NextApiResponse>()
      response.revalidate = revalidate
      return response
    }

    function createRevalidateFixture(args: MakeswiftApiHandlerArgs = {}) {
      const handler = createHandler(args)
      const revalidate = jest.fn()
      const response = revalidateResponse({ revalidate })
      return { handler, revalidate, response }
    }

    test('401s and does not call revalidate when no secret is provided', async () => {
      // Arrange
      const { handler, revalidate, response } = createRevalidateFixture()

      // Act
      await handler(
        createNextApiRequest({ method: 'GET', path: '/makeswift/revalidate' }),
        response,
      )

      // Assert
      expect(response.statusCode).toBe(401)
      expect(revalidate).not.toHaveBeenCalled()
    })

    test('400s and does not call revalidate when no path is provided', async () => {
      // Arrange
      const { handler, revalidate, response } = createRevalidateFixture()

      // Act
      await handler(
        createNextApiRequest({ method: 'GET', path: `/makeswift/revalidate?secret=${apiKey}` }),
        response,
      )

      // Assert
      expect(response.statusCode).toBe(400)
      expect(revalidate).not.toHaveBeenCalled()
    })

    test('200s and calls revalidate when revalidating a path', async () => {
      // Arrange
      const { handler, revalidate, response } = createRevalidateFixture()

      // Act
      await handler(
        createNextApiRequest({
          method: 'GET',
          path: `/makeswift/revalidate?secret=${apiKey}&path=/some-path`,
        }),
        response,
      )

      // Assert
      expect(response.statusCode).toBe(200)
      expect(revalidate).toHaveBeenCalledWith('/some-path')
    })
  })

  describe('/api/makeswift/webhook', () => {
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

    function createWebhookFixture(args: MakeswiftApiHandlerArgs = {}) {
      const handler = createHandler(args)

      const response = createResponse<NextApiResponse>()
      return { handler, response }
    }

    test('401s and does not call revalidateTag when no secret is provided', async () => {
      // Arrange
      const { handler, response } = createWebhookFixture()

      // Act
      await handler(
        createNextApiRequest({ method: 'POST', path: '/makeswift/webhook', body: webhookPayload }),
        response,
      )

      // Assert
      expect(response.statusCode).toBe(401)
      expect(response._getJSONData()).toEqual({ message: 'Unauthorized' })
      expect(nextCache.revalidateTag).not.toHaveBeenCalled()
    })

    test('400s and does not call revalidateTag when payload is invalid', async () => {
      // Arrange
      const { handler, response } = createWebhookFixture()

      // Act
      await handler(
        createNextApiRequest({
          method: 'POST',
          path: `/makeswift/webhook?secret=${apiKey}`,
          body: { type: 'invalid.type' },
        }),
        response,
      )

      // Assert
      expect(response.statusCode).toBe(400)
      expect(response._getJSONData()).toEqual({ message: 'Invalid request body' })
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
      const { handler, response } = createWebhookFixture({ events: { onPublish } })

      // Act
      await handler(
        createNextApiRequest({
          method: 'POST',
          path: `/makeswift/webhook?secret=${apiKey}`,
          body: webhookPayload,
        }),
        response,
      )

      // Assert
      expect(response.statusCode).toBe(200)
      expect(onPublish).toHaveBeenCalled()
    })

    test('200s and calls revalidateTag when user-provided onPublish callback fails', async () => {
      // Arrange
      const onPublish = jest.fn(() => {
        throw new Error('Failed in user-provided onPublish')
      })
      const { handler, response } = createWebhookFixture({ events: { onPublish } })

      // Act
      await handler(
        createNextApiRequest({
          method: 'POST',
          path: `/makeswift/webhook?secret=${apiKey}`,
          body: webhookPayload,
        }),
        response,
      )

      // Assert
      expect(response.statusCode).toBe(200)
      expect(nextCache.revalidateTag).toHaveBeenCalledWith('@@makeswift')

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Unhandled exception in the 'onPublish' callback:",
        expect.objectContaining({
          message: 'Failed in user-provided onPublish',
        }),
      )
    })
  })
})
