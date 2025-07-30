import * as nextHeaders from 'next/headers'
import { PRERENDER_BYPASS_COOKIE } from '../api-handler/preview'

import { appRouterApiRequestFixture, hostUrl } from './test-utils'

import { server } from '../../mocks/server'
import { http, HttpResponse } from 'msw'
import { TestOrigins } from '../../testing/fixtures'

const PATH = '/api/makeswift/redirect-preview'
const ORIGINAL_PATH = '/about-us'

const TEST_PREVIEW_TOKEN = 'test-preview-token'
const READ_PREVIEW_TOKEN_PATH = 'v1/preview-tokens/reads'
const SUCCESS_TOKEN_VERIFICATION_RESPONSE = {
  payload: { siteId: 'test-site-id', version: 'ref:working' },
  editable: true,
} as const

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
  draftMode: jest.fn(),
}))

afterEach(() => {
  jest.resetAllMocks()
})

const getCookie = (name: string) =>
  name === PRERENDER_BYPASS_COOKIE ? { name, value: '[prerender-bypass-cookie-value]' } : null

const authedUrl = ({
  path,
  previewToken,
  query,
}: {
  path: string
  previewToken: string | null
  query?: Record<string, string>
}) =>
  `${path}?${new URLSearchParams({ ...query, ...(previewToken ? { 'x-makeswift-preview-token': previewToken } : {}) }).toString()}`

describe('MakeswiftApiHandler', () => {
  const draftModeEnable = jest.fn()

  beforeEach(() => {
    jest.mocked(nextHeaders.draftMode).mockResolvedValue({
      enable: draftModeEnable,
      disable: jest.fn(),
    } as any)
  })

  describe.each([{ fixture: appRouterApiRequestFixture, router: 'app' }])(
    `[$router router] ${PATH}`,
    ({ fixture }) => {
      test('returns 400 if missing preview token', async () => {
        // Arrange
        const { testApiRequest } = fixture()

        // Act
        const { statusCode, textBody } = await testApiRequest({
          method: 'GET',
          path: authedUrl({ path: PATH, previewToken: null }),
          originalPath: authedUrl({ path: ORIGINAL_PATH, previewToken: null }),
        })

        // Assert
        expect(statusCode).toBe(400)
        expect(await textBody).toEqual('Bad request: no preview token provided')

        expect(nextHeaders.cookies).not.toHaveBeenCalled()
        expect(nextHeaders.draftMode).not.toHaveBeenCalled()
      })

      test("returns 500 if fails to find Next.js' draft mode cookie", async () => {
        // Arrange
        const { testApiRequest } = fixture()

        jest.mocked(nextHeaders.cookies).mockResolvedValue({
          get: jest.fn(() => null),
        } as any)

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
        expect(await textBody).toEqual('Could not retrieve draft mode bypass cookie')

        expect(nextHeaders.cookies).toHaveBeenCalledTimes(1)
        expect(nextHeaders.draftMode).toHaveBeenCalledTimes(1)
        expect(draftModeEnable).toHaveBeenCalledTimes(1)
      })

      test('returns 401 AND does not enable draft mode if unable to verify preview token', async () => {
        // Arrange
        const { testApiRequest } = fixture()

        jest.mocked(nextHeaders.cookies).mockResolvedValue({
          get: jest.fn(() => null),
        } as any)

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

        expect(nextHeaders.cookies).toHaveBeenCalledTimes(0)
        expect(nextHeaders.draftMode).toHaveBeenCalledTimes(0)
        expect(draftModeEnable).toHaveBeenCalledTimes(0)
      })

      test('sets draft mode cookies, redirects to the original URL', async () => {
        // Arrange
        const { testApiRequest } = fixture()

        jest.mocked(nextHeaders.cookies).mockResolvedValue({
          get: jest.fn(getCookie),
        } as any)

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
        expect(statusCode).toBe(307)
        expect(headers.get('location')).toBe(hostUrl(ORIGINAL_PATH).toString())

        expect(headers.getSetCookie()).toEqual([
          '__prerender_bypass=%5Bprerender-bypass-cookie-value%5D; Path=/; HttpOnly; Secure; Partitioned; SameSite=None',
          'makeswift-site-version=%7B%22version%22%3A%22ref%3Aworking%22%2C%22token%22%3A%22test-preview-token%22%7D; Path=/; HttpOnly; Secure; Partitioned; SameSite=None',
        ])

        expect(nextHeaders.cookies).toHaveBeenCalledTimes(1)
        expect(nextHeaders.draftMode).toHaveBeenCalledTimes(1)
        expect(draftModeEnable).toHaveBeenCalledTimes(1)
      })

      test('preserves original URL query parameters on redirect', async () => {
        // Arrange
        const { testApiRequest } = fixture()

        jest.mocked(nextHeaders.cookies).mockResolvedValue({
          get: jest.fn(getCookie),
        } as any)

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
        expect(statusCode).toBe(307)
        expect(headers.get('location')).toBe(
          hostUrl(`${ORIGINAL_PATH}?foo=bar&version=ref%3Alive`).toString(),
        )

        expect(nextHeaders.cookies).toHaveBeenCalledTimes(1)
        expect(nextHeaders.draftMode).toHaveBeenCalledTimes(1)
        expect(draftModeEnable).toHaveBeenCalledTimes(1)
      })
    },
  )
})
