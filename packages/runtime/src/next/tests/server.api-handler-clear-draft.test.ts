import { apiRequestFixtures } from './test-utils'

const PATH = '/api/makeswift/clear-draft'

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
      expect(statusCode).toBe(200)
    })

    test('clears the corresponding draft/preview mode cookies', async () => {
      // Arrange
      const { testApiRequest } = fixture()

      // Act
      const { statusCode, headers } = await testApiRequest({
        method: 'GET',
        path: PATH,
      })

      // Assert
      expect(statusCode).toBe(200)
      expect(headers.getSetCookie()).toEqual(
        router == 'pages'
          ? [
              '__prerender_bypass=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; Partitioned; SameSite=None',
              '__next_preview_data=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; Partitioned; SameSite=None',
            ]
          : [
              '__prerender_bypass=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; Partitioned; SameSite=None',
              'makeswift-site-version=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; Partitioned; SameSite=None',
            ],
      )
    })
  })
})
