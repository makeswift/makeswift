import { createResponse } from 'node-mocks-http'
import { NextApiResponse } from 'next'
import { serialize, type SerializeOptions } from 'cookie'
import { PRERENDER_BYPASS_COOKIE, PREVIEW_DATA_COOKIE } from '../api-handler/handlers/utils/draft'

import { pagesRouterApiRequestFixture, type MakeswiftApiHandlerArgs } from './test-utils'

const PATH = '/api/makeswift/preview'
const ORIGINAL_PATH = '/about-us'

afterEach(() => {
  jest.resetAllMocks()
})

const authedUrl = ({
  path,
  apiKey,
  query,
}: {
  path: string
  apiKey: string | null
  query?: Record<string, string>
}) =>
  `${path}?${new URLSearchParams({ ...query, ...(apiKey ? { 'x-makeswift-preview-mode': apiKey } : {}) }).toString()}`

const previewCookieOptions: SerializeOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
  path: '/',
}

const setResponsePreviewData = (response: NextApiResponse, data: Record<string, unknown>) => {
  const payload = JSON.stringify(data)

  response.setHeader('Set-Cookie', [
    serialize(PRERENDER_BYPASS_COOKIE, '[prerender-bypass-cookie-value]', previewCookieOptions),
    serialize(PREVIEW_DATA_COOKIE, payload, previewCookieOptions),
  ])
}

function pagesRouterRedirectPreviewFixture({
  setResponsePreviewData,
  ...args
}: MakeswiftApiHandlerArgs & {
  setResponsePreviewData?: (res: NextApiResponse, data: Record<string, unknown>) => void
} = {}) {
  const response = createResponse<NextApiResponse>()
  response.setPreviewData = jest.fn().mockImplementation((data: Record<string, unknown>) => {
    setResponsePreviewData?.(response, data)
    return response
  })

  return {
    ...pagesRouterApiRequestFixture(args, response),
    setPreviewData: response.setPreviewData,
  }
}

describe('MakeswiftApiHandler', () => {
  describe.each([{ fixture: pagesRouterRedirectPreviewFixture, router: 'pages' }])(
    `[$router router] ${PATH}`,
    ({ fixture }) => {
      test.each([{ apiKey: null }, { apiKey: 'incorrect-api-key' }])(
        'requires authentication ($apiKey)',
        async ({ apiKey }) => {
          // Arrange
          const { testApiRequest, setPreviewData } = fixture()

          // Act
          const { statusCode, textBody } = await testApiRequest({
            method: 'GET',
            path: authedUrl({ path: PATH, apiKey }),
            originalPath: authedUrl({ path: ORIGINAL_PATH, apiKey }),
          })

          // Assert
          expect(statusCode).toBe(401)
          expect(await textBody).toEqual(
            `Unauthorized to enable preview mode: ${apiKey ? 'secret is incorrect' : 'no secret provided'}`,
          )

          expect(setPreviewData).not.toHaveBeenCalled()
        },
      )

      test('returns 400 if fails to find the original pathname', async () => {
        // Arrange
        const { testApiRequest, setPreviewData, apiKey } = fixture()

        // Act
        const { statusCode, textBody } = await testApiRequest({
          method: 'GET',
          path: authedUrl({ path: PATH, apiKey }),
        })

        // Assert
        expect(statusCode).toBe(400)
        expect(await textBody).toEqual(
          'Bad request: incoming request does not have an associated pathname',
        )

        expect(setPreviewData).not.toHaveBeenCalled()
      })

      test("returns 500 if fails to find Next.js' preview mode cookie", async () => {
        const { testApiRequest, setPreviewData, apiKey } = fixture()

        // Act
        const { statusCode, textBody } = await testApiRequest({
          method: 'GET',
          path: authedUrl({ path: PATH, apiKey }),
          originalPath: authedUrl({ path: ORIGINAL_PATH, apiKey }),
        })

        // Assert
        expect(statusCode).toBe(500)
        expect(await textBody).toEqual('Could not retrieve preview mode cookies')

        expect(setPreviewData).toHaveBeenCalled()
      })

      test('sets preview mode cookies, redirects to the original URL', async () => {
        // Arrange
        const { testApiRequest, setPreviewData, apiKey } = fixture({
          setResponsePreviewData,
        })

        // Act
        const { statusCode, headers } = await testApiRequest({
          method: 'GET',
          path: authedUrl({ path: PATH, apiKey }),
          originalPath: authedUrl({ path: ORIGINAL_PATH, apiKey }),
        })

        // Assert
        expect(statusCode).toBe(302)
        expect(headers.get('location')).toBe(`${ORIGINAL_PATH}?`)

        expect(headers.getSetCookie()).toEqual([
          '__prerender_bypass=%5Bprerender-bypass-cookie-value%5D; Path=/; HttpOnly; Secure; Partitioned; SameSite=None',
          '__next_preview_data=%7B%22makeswift%22%3Atrue%2C%22siteVersion%22%3A%22Working%22%7D; Path=/; HttpOnly; Secure; Partitioned; SameSite=None',
        ])

        expect(setPreviewData).toHaveBeenCalledTimes(1)
      })

      test('preserves original URL query parameters on redirect', async () => {
        // Arrange
        const { testApiRequest, setPreviewData, apiKey } = fixture({
          setResponsePreviewData,
        })

        // Act
        const { statusCode, headers } = await testApiRequest({
          method: 'GET',
          path: authedUrl({ path: PATH, apiKey }),
          originalPath: authedUrl({
            path: ORIGINAL_PATH,
            apiKey,
            query: { foo: 'bar', version: 'ref:live' },
          }),
        })

        // Assert
        expect(statusCode).toBe(302)
        expect(headers.get('location')).toBe(`${ORIGINAL_PATH}?foo=bar&version=ref%3Alive`)

        expect(setPreviewData).toHaveBeenCalledTimes(1)
      })
    },
  )
})
