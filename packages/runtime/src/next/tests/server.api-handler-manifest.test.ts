import { apiRequestFixtures } from './test-utils'

const PATH = '/api/makeswift/manifest'

afterEach(() => {
  jest.resetAllMocks()
})

describe('MakeswiftApiHandler', () => {
  describe.each(apiRequestFixtures)('[$router router] ${PATH}', ({ fixture }) => {
    test.each([{ apiKey: null }, { apiKey: 'incorrect-api-key' }])(
      'requires authentication ($apiKey)',
      async ({ apiKey }) => {
        // Arrange
        const { testApiRequest } = fixture()

        // Act
        const { statusCode, jsonBody } = await testApiRequest({
          method: 'GET',
          path: apiKey ? `${PATH}?secret=${apiKey}` : PATH,
        })

        // Assert
        expect(statusCode).toBe(401)
        expect(await jsonBody).toEqual({ message: 'Unauthorized' })
      },
    )

    test('returns expected manifest data when authenticated', async () => {
      // Arrange
      const { testApiRequest, apiKey } = fixture()

      // Act
      const { statusCode, jsonBody } = await testApiRequest({
        method: 'GET',
        path: `${PATH}?secret=${apiKey}`,
      })

      // Assert
      expect(statusCode).toBe(200)

      expect(await jsonBody).toEqual({
        version: PACKAGE_VERSION,
        interactionMode: true,
        clientSideNavigation: false,
        elementFromPoint: false,
        customBreakpoints: true,
        siteVersions: true,
        unstable_siteVersions: true,
        localizedPageSSR: true,
        webhook: true,
        localizedPagesOnlineByDefault: true,
        previewToken: true,
      })
    })
  })
})
