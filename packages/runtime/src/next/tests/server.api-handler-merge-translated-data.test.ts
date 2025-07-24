import { apiRequestFixtures } from './test-utils'

import { elementTree } from './__fixtures__/element-tree'
import { translatedData } from './__fixtures__/translated-data'

const PATH = '/api/makeswift/merge-translated-data'

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
        method: 'POST',
        path: PATH,
        body: {
          translatedData: {},
          elementTree: {},
        },
      })

      // Assert
      expect(statusCode).toBe(200)
    })

    test.each([
      { body: {}, message: 'translatedData must be defined' },
      { body: { translatedData: {} }, message: 'elementTree must be defined' },
    ])('returns 400 on missing arguments ($message)', async ({ body, message }) => {
      // Arrange
      const { testApiRequest } = fixture()

      // Act
      const { statusCode, jsonBody } = await testApiRequest({
        method: 'POST',
        path: PATH,
        body,
      })

      // Assert
      expect(statusCode).toBe(400)
      expect(await jsonBody).toEqual({ message })
    })

    test('returns translatable data for the given element tree', async () => {
      // Arrange
      const { testApiRequest } = fixture()

      // Act
      const { statusCode, jsonBody } = await testApiRequest({
        method: 'POST',
        path: PATH,
        body: {
          translatedData,
          elementTree,
        },
      })

      // Assert
      expect(statusCode).toBe(200)
      expect(await jsonBody).toMatchSnapshot('translated tree')
    })
  })
})
