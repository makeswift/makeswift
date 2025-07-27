import { apiRequestFixtures } from './test-utils'

afterEach(() => {
  jest.resetAllMocks()
})

describe('MakeswiftApiHandler', () => {
  describe.each(apiRequestFixtures)('[$router router] error handling', ({ fixture }) => {
    test.each(['/api/makeswift/', '/api/makeswift/non-existing-route'])(
      '404s on unknown API route (%s)',
      async path => {
        // Arrange
        const { testApiRequest } = fixture()

        // Act
        const { statusCode, jsonBody } = await testApiRequest({
          method: 'GET',
          path,
        })

        // Assert
        expect(statusCode).toBe(404)
        expect(await jsonBody).toEqual({ message: 'Not Found' })
      },
    )

    test.each(['/makeswift/fonts', '/api/makefast/fonts'])(
      'throws when installed at a wrong path (%s)',
      async path => {
        // Arrange
        const { testApiRequest } = fixture()

        // Act & Assert
        await expect(() =>
          testApiRequest({
            method: 'GET',
            path,
          }),
        ).rejects.toThrow(
          'The Makeswift Next.js API handler must be used in a dynamic catch-all route named `[...makeswift]`',
        )
      },
    )
  })
})
