import { createResponse } from 'node-mocks-http'
import { NextApiResponse } from 'next'
import * as nextCache from 'next/cache'

import {
  pagesRouterApiRequestFixture,
  appRouterApiRequestFixture,
  type MakeswiftApiHandlerArgs,
} from './test-utils'

const PATH = '/api/makeswift/revalidate'

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

afterEach(() => {
  jest.resetAllMocks()
})

function pagesRouterRevalidateFixture(args: MakeswiftApiHandlerArgs = {}) {
  function revalidateResponse({ revalidate }: { revalidate: (path: string) => Promise<void> }) {
    const response = createResponse<NextApiResponse>()
    response.revalidate = revalidate
    return response
  }

  const revalidate = jest.fn()
  return { ...pagesRouterApiRequestFixture(args, revalidateResponse({ revalidate })), revalidate }
}

function appRouterRevalidateFixture(args: MakeswiftApiHandlerArgs = {}) {
  return { ...appRouterApiRequestFixture(args), revalidate: nextCache.revalidatePath }
}

describe('MakeswiftApiHandler', () => {
  describe.each([
    { fixture: pagesRouterRevalidateFixture, router: 'pages' },
    { fixture: appRouterRevalidateFixture, router: 'app' },
  ])('[$router router] ${PATH}', ({ fixture }) => {
    test.each([{ apiKey: null }, { apiKey: 'incorrect-api-key' }])(
      'requires authentication ($apiKey), does not call revalidate',
      async ({ apiKey }) => {
        // Arrange
        const { testApiRequest, revalidate } = fixture()

        // Act
        const { statusCode, jsonBody } = await testApiRequest({
          method: 'GET',
          path: apiKey ? `${PATH}?secret=${apiKey}` : PATH,
        })

        // Assert
        expect(statusCode).toBe(401)
        expect(revalidate).not.toHaveBeenCalled()
        expect(await jsonBody).toEqual({ message: 'Unauthorized' })
      },
    )

    test('400s and does not call revalidate when no path is provided', async () => {
      // Arrange
      const { testApiRequest, apiKey, revalidate } = fixture()

      // Act
      const { statusCode, jsonBody } = await testApiRequest({
        method: 'GET',
        path: `${PATH}?secret=${apiKey}`,
      })

      // Assert
      expect(statusCode).toBe(400)
      expect(revalidate).not.toHaveBeenCalled()
      expect(await jsonBody).toEqual({ message: 'Bad Request' })
    })

    test('200s and calls revalidate when revalidating a path', async () => {
      // Arrange
      const { testApiRequest, apiKey, revalidate } = fixture()

      // Act
      const { statusCode } = await testApiRequest({
        method: 'GET',
        path: `${PATH}?secret=${apiKey}&path=/some-path`,
      })

      // Assert
      expect(statusCode).toBe(200)
      expect(revalidate).toHaveBeenCalledWith('/some-path')
    })
  })
})
