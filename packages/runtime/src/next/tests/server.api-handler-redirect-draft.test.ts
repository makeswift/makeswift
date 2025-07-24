import * as nextHeaders from 'next/headers'
import { PRERENDER_BYPASS_COOKIE } from '../api-handler/handlers/utils/draft'

import { appRouterApiRequestFixture, hostUrl } from './test-utils'

const PATH = '/api/makeswift/draft'
const ORIGINAL_PATH = '/about-us'

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
  apiKey,
  query,
}: {
  path: string
  apiKey: string | null
  query?: Record<string, string>
}) =>
  `${path}?${new URLSearchParams({ ...query, ...(apiKey ? { 'x-makeswift-draft-mode': apiKey } : {}) }).toString()}`

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
      test.each([{ apiKey: null }, { apiKey: 'incorrect-api-key' }])(
        'requires authentication ($apiKey)',
        async ({ apiKey }) => {
          // Arrange
          const { testApiRequest } = fixture()

          // Act
          const { statusCode, textBody } = await testApiRequest({
            method: 'GET',
            path: authedUrl({ path: PATH, apiKey }),
            originalPath: authedUrl({ path: ORIGINAL_PATH, apiKey }),
          })

          // Assert
          expect(statusCode).toBe(401)
          expect(await textBody).toEqual(
            `Unauthorized to enable draft mode: ${apiKey ? 'incorrect secret' : 'no secret provided'}`,
          )

          expect(nextHeaders.cookies).not.toHaveBeenCalled()
          expect(nextHeaders.draftMode).not.toHaveBeenCalled()
        },
      )

      test("returns 500 if fails to find Next.js' draft mode cookie", async () => {
        // Arrange
        const { testApiRequest, apiKey } = fixture()

        jest.mocked(nextHeaders.cookies).mockResolvedValue({
          get: jest.fn(() => null),
        } as any)

        // Act
        const { statusCode, textBody } = await testApiRequest({
          method: 'GET',
          path: authedUrl({ path: PATH, apiKey }),
          originalPath: authedUrl({ path: ORIGINAL_PATH, apiKey }),
        })

        // Assert
        expect(statusCode).toBe(500)
        expect(await textBody).toEqual('Could not retrieve draft mode bypass cookie')

        expect(nextHeaders.cookies).toHaveBeenCalledTimes(1)
        expect(nextHeaders.draftMode).toHaveBeenCalledTimes(1)
        expect(draftModeEnable).toHaveBeenCalledTimes(1)
      })

      test('sets draft mode cookies, redirects to the original URL', async () => {
        // Arrange
        const { testApiRequest, apiKey } = fixture()

        jest.mocked(nextHeaders.cookies).mockResolvedValue({
          get: jest.fn(getCookie),
        } as any)

        // Act
        const { statusCode, headers } = await testApiRequest({
          method: 'GET',
          path: authedUrl({ path: PATH, apiKey }),
          originalPath: authedUrl({ path: ORIGINAL_PATH, apiKey }),
        })

        // Assert
        expect(statusCode).toBe(307)
        expect(headers.get('location')).toBe(hostUrl(ORIGINAL_PATH).toString())

        expect(headers.getSetCookie()).toEqual([
          '__prerender_bypass=%5Bprerender-bypass-cookie-value%5D; Path=/; HttpOnly; Secure; Partitioned; SameSite=None',
          'x-makeswift-draft-data=%7B%22makeswift%22%3Atrue%2C%22siteVersion%22%3A%22Working%22%7D; Path=/; HttpOnly; Secure; Partitioned; SameSite=None',
        ])

        expect(nextHeaders.cookies).toHaveBeenCalledTimes(1)
        expect(nextHeaders.draftMode).toHaveBeenCalledTimes(1)
        expect(draftModeEnable).toHaveBeenCalledTimes(1)
      })

      test('preserves original URL query parameters on redirect', async () => {
        // Arrange
        const { testApiRequest, apiKey } = fixture()

        jest.mocked(nextHeaders.cookies).mockResolvedValue({
          get: jest.fn(getCookie),
        } as any)

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
