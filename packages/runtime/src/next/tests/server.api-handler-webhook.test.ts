import { randomUUID } from 'crypto'
import * as nextCache from 'next/cache'

import { apiRequestFixtures } from './test-utils'

const PATH = '/api/makeswift/webhook'

jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}))

afterEach(() => {
  jest.resetAllMocks()
})

describe('MakeswiftApiHandler', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe.each(apiRequestFixtures)('[$router router] ${PATH}', ({ fixture, router }) => {
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

    test.each([{ apiKey: null }, { apiKey: 'incorrect-api-key' }])(
      'requires authentication ($apiKey), does not call revalidateTag',
      async ({ apiKey }) => {
        // Arrange
        const { testApiRequest } = fixture()

        // Act
        const { statusCode, jsonBody } = await testApiRequest({
          method: 'POST',
          path: apiKey ? `${PATH}?secret=${apiKey}` : PATH,
          body: webhookPayload,
        })

        // Assert
        expect(statusCode).toBe(401)
        expect(await jsonBody).toEqual({ message: 'Unauthorized' })
        expect(nextCache.revalidateTag).not.toHaveBeenCalled()
      },
    )

    test('400s and does not call revalidateTag when payload is invalid', async () => {
      // Arrange
      const { testApiRequest, apiKey } = fixture()

      // Act
      const { statusCode, jsonBody } = await testApiRequest({
        method: 'POST',
        path: `${PATH}?secret=${apiKey}`,
        body: { type: 'invalid.type' },
      })

      // Assert
      expect(statusCode).toBe(400)
      expect(await jsonBody).toEqual({ message: 'Invalid request body' })
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
      const { testApiRequest, apiKey } = fixture({ events: { onPublish } })

      // Act
      const { statusCode } = await testApiRequest({
        method: 'POST',
        path: `${PATH}?secret=${apiKey}`,
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
      const { testApiRequest, apiKey } = fixture({ events: { onPublish } })

      // Act
      const { statusCode } = await testApiRequest({
        method: 'POST',
        path: `${PATH}?secret=${apiKey}`,
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
