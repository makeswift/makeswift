import { apiRequestFixtures } from './test-utils'

const PATH = '/api/makeswift/redirect-live'

const ORIGINAL_PATH = '/about-us'

afterEach(() => {
  jest.resetAllMocks()
})

describe('MakeswiftApiHandler', () => {
  describe.each(apiRequestFixtures)('[$router router] ${PATH}', ({ fixture, router }) => {
    test('does not require authentication', async () => {
      // Arrange
      const { testApiRequest } = fixture()

      // Act
      const { statusCode } = await testApiRequest({
        method: 'GET',
        path: PATH,
      })

      // Assert
      expect(statusCode).toBe(307)
    })

    test('clears the corresponding draft/preview mode cookies', async () => {
      // Arrange
      const { testApiRequest } = fixture()

      // Act
      const { statusCode, headers } = await testApiRequest({
        method: 'GET',
        path: PATH,
        originalPath: `${ORIGINAL_PATH}?makeswift-redirect-live=/next-path`,
      })

      // Assert
      expect(statusCode).toBe(307)
      expect(headers.getSetCookie()).toEqual(
        router === 'pages'
          ? [
              '__prerender_bypass=; Max-Age=0; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; Partitioned; SameSite=None',
              '__next_preview_data=; Max-Age=0; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; Partitioned; SameSite=None',
            ]
          : [
              '__prerender_bypass=; Max-Age=0; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; Partitioned; SameSite=None',
              'makeswift-site-version=; Max-Age=0; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; Partitioned; SameSite=None',
            ],
      )

      const redirectLocation = headers.get('Location')

      expect(redirectLocation).toBe('/next-path')
      expect(redirectLocation?.includes('makeswift-redirect-live')).toBe(false)
    })
  })
})
