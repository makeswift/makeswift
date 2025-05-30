import { apiRequestFixtures } from './test-utils'

afterEach(() => {
  jest.resetAllMocks()
})

describe('MakeswiftApiHandler', () => {
  describe.each(apiRequestFixtures)('[$router router] CORS requests', ({ fixture }) => {
    test.each(['/api/makeswift/manifest', '/api/makeswift/fonts'])(
      'responds with 204 and appropriate CORS headers to a preflight request (%s)',
      async path => {
        // Arrange
        const { testApiRequest } = fixture()

        // Act
        const { statusCode, headers, textBody } = await testApiRequest({
          method: 'OPTIONS',
          path,
        })

        // Assert
        expect(statusCode).toBe(204)
        expect(headers.get('content-length')).toBe('0')
        expect(headers.get('access-control-allow-origin')).toBe('https://app.fakeswift.com')
        expect(headers.get('access-control-allow-methods')).toBe(
          'GET, HEAD, PUT, POST, DELETE, PATCH, OPTIONS',
        )
        expect(headers.get('access-control-allow-headers')).toBe('Content-Type, Authorization')
        expect(await textBody).toBe('')
      },
    )

    test.each(['/api/makeswift/manifest', '/api/makeswift/fonts'])(
      'adds appropriate CORS headers to regular requests (%s)',
      async path => {
        // Arrange
        const { testApiRequest, apiKey } = fixture()

        // Act
        const { statusCode, headers, jsonBody } = await testApiRequest({
          method: 'GET',
          path: `${path}?secret=${apiKey}`,
        })

        // Assert
        expect(statusCode).toBe(200)
        expect(await jsonBody).not.toBe(null)
        expect(headers.get('access-control-allow-origin')).toBe('https://app.fakeswift.com')
        expect(headers.get('access-control-allow-methods')).toBe(
          'GET, HEAD, PUT, POST, DELETE, PATCH, OPTIONS',
        )
        expect(headers.get('access-control-allow-headers')).toBe('Content-Type, Authorization')
      },
    )
  })
})
