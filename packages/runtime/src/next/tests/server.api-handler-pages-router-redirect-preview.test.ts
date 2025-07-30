import { createResponse } from 'node-mocks-http'
import { NextApiResponse } from 'next'
import { serialize, type SerializeOptions } from 'cookie'
import { PRERENDER_BYPASS_COOKIE, PREVIEW_DATA_COOKIE } from '../api-handler/preview'

import { pagesRouterApiRequestFixture, type MakeswiftApiHandlerArgs } from './test-utils'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { TestOrigins } from '../../testing/fixtures'

const PATH = '/api/makeswift/redirect-preview'
const ORIGINAL_PATH = '/about-us'

const TEST_PREVIEW_TOKEN = 'test-preview-token'
const READ_PREVIEW_TOKEN_PATH = 'v1/preview-tokens/reads'
const SUCCESS_TOKEN_VERIFICATION_RESPONSE = {
  payload: { siteId: 'test-site-id', version: 'ref:working' },
  editable: true,
} as const

afterEach(() => {
  jest.resetAllMocks()
})

const authedUrl = ({
  path,
  previewToken,
  query,
}: {
  path: string
  previewToken: string | null
  query?: Record<string, string>
}) =>
  `${path}?${new URLSearchParams({ ...query, ...(previewToken ? { 'makeswift-preview-token': previewToken } : {}) }).toString()}`

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
      test('returns 400 if missing preview token', async () => {
        // Arrange
        const { testApiRequest, setPreviewData } = fixture()

        // Act
        const { statusCode, textBody } = await testApiRequest({
          method: 'GET',
          path: authedUrl({ path: PATH, previewToken: null }),
          originalPath: authedUrl({ path: ORIGINAL_PATH, previewToken: null }),
        })

        // Assert
        expect(statusCode).toBe(400)
        expect(await textBody).toEqual('Bad request: no preview token provided')

        expect(setPreviewData).not.toHaveBeenCalled()
      })

      test('returns 400 if fails to find the original pathname', async () => {
        // Arrange
        const { testApiRequest, setPreviewData } = fixture()

        // Act
        const { statusCode, textBody } = await testApiRequest({
          method: 'GET',
          path: authedUrl({ path: PATH, previewToken: TEST_PREVIEW_TOKEN }),
        })

        // Assert
        expect(statusCode).toBe(400)
        expect(await textBody).toEqual(
          'Bad request: incoming request does not have an associated pathname',
        )

        expect(setPreviewData).not.toHaveBeenCalled()
      })

      test('returns 401 and does not enable preview mode if unable to verify preview token', async () => {
        const { testApiRequest, setPreviewData } = fixture()

        server.use(
          http.post(
            `${TestOrigins.apiOrigin}/${READ_PREVIEW_TOKEN_PATH}`,
            () => HttpResponse.text('Unable to verify token', { status: 401 }),
            { once: true },
          ),
        )

        // Act
        const { statusCode, textBody } = await testApiRequest({
          method: 'GET',
          path: authedUrl({ path: PATH, previewToken: TEST_PREVIEW_TOKEN }),
          originalPath: authedUrl({ path: ORIGINAL_PATH, previewToken: TEST_PREVIEW_TOKEN }),
        })

        // Assert
        expect(statusCode).toBe(401)
        expect(await textBody).toEqual('Failed to verify preview token')

        expect(setPreviewData).not.toHaveBeenCalled()
      })

      test("returns 500 if fails to find Next.js' preview mode cookie", async () => {
        const { testApiRequest, setPreviewData } = fixture()

        server.use(
          http.post(
            `${TestOrigins.apiOrigin}/${READ_PREVIEW_TOKEN_PATH}`,
            () => HttpResponse.json(SUCCESS_TOKEN_VERIFICATION_RESPONSE, { status: 200 }),
            { once: true },
          ),
        )

        // Act
        const { statusCode, textBody } = await testApiRequest({
          method: 'GET',
          path: authedUrl({ path: PATH, previewToken: TEST_PREVIEW_TOKEN }),
          originalPath: authedUrl({ path: ORIGINAL_PATH, previewToken: TEST_PREVIEW_TOKEN }),
        })

        // Assert
        expect(statusCode).toBe(500)
        expect(await textBody).toEqual('Could not retrieve preview mode cookies')

        expect(setPreviewData).toHaveBeenCalled()
      })

      test('sets preview mode cookies, redirects to the original URL', async () => {
        // Arrange
        const { testApiRequest, setPreviewData } = fixture({
          setResponsePreviewData,
        })

        server.use(
          http.post(
            `${TestOrigins.apiOrigin}/${READ_PREVIEW_TOKEN_PATH}`,
            () => HttpResponse.json(SUCCESS_TOKEN_VERIFICATION_RESPONSE, { status: 200 }),
            { once: true },
          ),
        )

        // Act
        const { statusCode, headers } = await testApiRequest({
          method: 'GET',
          path: authedUrl({ path: PATH, previewToken: TEST_PREVIEW_TOKEN }),
          originalPath: authedUrl({ path: ORIGINAL_PATH, previewToken: TEST_PREVIEW_TOKEN }),
        })

        // Assert
        expect(statusCode).toBe(302)
        expect(headers.get('location')).toBe(`${ORIGINAL_PATH}?`)

        expect(headers.getSetCookie()).toEqual([
          '__prerender_bypass=%5Bprerender-bypass-cookie-value%5D; Path=/; HttpOnly; Secure; Partitioned; SameSite=None',
          '__next_preview_data=%7B%22siteVersion%22%3A%22%7B%5C%22version%5C%22%3A%5C%22ref%3Aworking%5C%22%2C%5C%22token%5C%22%3A%5C%22test-preview-token%5C%22%7D%22%7D; Path=/; HttpOnly; Secure; Partitioned; SameSite=None',
        ])

        expect(setPreviewData).toHaveBeenCalledTimes(1)
      })

      test('preserves original URL query parameters on redirect', async () => {
        // Arrange
        const { testApiRequest, setPreviewData } = fixture({
          setResponsePreviewData,
        })

        server.use(
          http.post(
            `${TestOrigins.apiOrigin}/${READ_PREVIEW_TOKEN_PATH}`,
            () => HttpResponse.json(SUCCESS_TOKEN_VERIFICATION_RESPONSE, { status: 200 }),
            { once: true },
          ),
        )

        // Act
        const { statusCode, headers } = await testApiRequest({
          method: 'GET',
          path: authedUrl({ path: PATH, previewToken: TEST_PREVIEW_TOKEN }),
          originalPath: authedUrl({
            path: ORIGINAL_PATH,
            previewToken: TEST_PREVIEW_TOKEN,
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
