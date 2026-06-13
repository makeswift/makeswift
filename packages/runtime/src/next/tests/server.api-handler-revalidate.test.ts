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

  function flushMicrotasks() {
    return new Promise(resolve => setImmediate(resolve))
  }

  // Pages Router revalidates via the async `res.revalidate`, so the handler
  // must fully await it before responding.
  describe('[pages router]', () => {
    test('does not respond until revalidation completes', async () => {
      // Arrange
      let resolveRevalidate: () => void = () => {}
      const revalidatePromise = new Promise<void>(resolve => {
        resolveRevalidate = resolve
      })
      const { testApiRequest, apiKey, revalidate } = pagesRouterRevalidateFixture()
      revalidate.mockReturnValue(revalidatePromise)

      // Act
      let responded = false
      const requestPromise = testApiRequest({
        method: 'GET',
        path: `${PATH}?secret=${apiKey}&path=/some-path`,
      }).then(result => {
        responded = true
        return result
      })

      // Assert
      await flushMicrotasks()
      expect(revalidate).toHaveBeenCalledWith('/some-path')
      // While revalidation is in flight, the handler should not have responded
      expect(responded).toBe(false)

      resolveRevalidate()
      const { statusCode } = await requestPromise
      expect(responded).toBe(true)
      expect(statusCode).toBe(200)
    })
  })
})
