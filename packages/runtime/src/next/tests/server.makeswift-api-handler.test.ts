import { MakeswiftApiHandler } from "../api-handler"
import { NextApiRequest, NextApiResponse } from 'next'
import { ReactRuntime } from "../../react"

import { createRequest, createResponse } from "node-mocks-http"

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

describe('MakeswiftApiHandler', () => {
  describe('/api/makeswift/revalidate', () => {
    function revalidateRequest(
      query: Record<string, string | string[]> = {},
    ) {
      return createRequest<NextApiRequest>({
        method: 'GET',
        query: { makeswift: ['revalidate'], ...query },
      })
    }

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
      await handler(revalidateRequest(), response)

      // Assert
      expect(response.statusCode).toBe(401)
      expect(revalidate).not.toHaveBeenCalled()
    })

    test('400s and does not call revalidate when no path is provided', async () => {
      // Arrange
      const { handler, revalidate, response } = createRevalidateFixture()

      // Act
      await handler(
        revalidateRequest({ secret: apiKey }),
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
        revalidateRequest({ secret: apiKey, path: '/some-path' }),
        response,
      )

      // Assert
      expect(response.statusCode).toBe(200)
      expect(revalidate).toHaveBeenCalledWith('/some-path')
    })

    test('200s and calls user-provided onPublish callback when revalidating a path', async () => {
      // Arrange
      const onPublish = jest.fn()
      const { handler, response } = createRevalidateFixture({
        onPublish,
      })

      // Act
      await handler(
        revalidateRequest({ secret: apiKey, path: '/some-path/' }),
        response,
      )

      // Assert
      expect(response.statusCode).toBe(200)
      expect(onPublish).toHaveBeenCalledWith('/some-path/')
    })

    test('200s and calls revalidate when revalidating a path and user-provided onPublish callback fails', async () => {
      // Arrange
      const onPublish = jest.fn(() => {
        throw new Error('Failed to publish')
      })
      const { handler, revalidate, response } = createRevalidateFixture({
        onPublish,
      })

      // Act
      await handler(
        revalidateRequest({ secret: apiKey, path: '/some-path' }),
        response,
      )

      // Assert
      expect(response.statusCode).toBe(200)
      expect(revalidate).toHaveBeenCalledWith('/some-path')
    })
  })
})
