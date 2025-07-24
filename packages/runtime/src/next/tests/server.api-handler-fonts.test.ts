import { type Font } from '../api-handler/handlers/fonts'
import { apiRequestFixtures } from './test-utils'

const PATH = '/api/makeswift/fonts'

afterEach(() => {
  jest.resetAllMocks()
})

describe('MakeswiftApiHandler', () => {
  describe.each(apiRequestFixtures)('[$router router] ${PATH}', ({ fixture }) => {
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

    test('returns empty font data when no fonts were provided', async () => {
      // Arrange
      const { testApiRequest } = fixture()

      // Act
      const { statusCode, jsonBody } = await testApiRequest({
        method: 'GET',
        path: PATH,
      })

      // Assert
      expect(statusCode).toBe(200)
      expect(await jsonBody).toEqual([])
    })

    test('returns resolved font data when fonts are provided', async () => {
      // Arrange
      const fonts: Font[] = [
        {
          family: 'var(--font-inter)',
          label: 'Inter',
          variants: [
            { weight: '400', style: 'normal' },
            { weight: '400', style: 'italic' },
          ],
        },
        {
          family: 'var(--font-open-sans)',
          label: 'Open Sans',
          variants: [
            { weight: '400', style: 'normal' },
            { weight: '400', style: 'italic' },
            { weight: '600', style: 'normal' },
            { weight: '600', style: 'normal' },
          ],
        },
      ]

      const { testApiRequest } = fixture({
        getFonts: async () => Promise.resolve(fonts),
      })

      // Act
      const { statusCode, jsonBody } = await testApiRequest({
        method: 'GET',
        path: PATH,
      })

      // Assert
      expect(statusCode).toBe(200)
      expect(await jsonBody).toEqual(fonts)
    })
  })
})
