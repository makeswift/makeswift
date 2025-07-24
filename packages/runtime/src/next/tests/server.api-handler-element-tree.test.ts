import { apiRequestFixtures } from './test-utils'

import { elementTree } from './__fixtures__/element-tree'

const PATH = '/api/makeswift/element-tree'

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
          elementTree: {},
          replacementContext: {},
        },
      })

      // Assert
      expect(statusCode).toBe(200)
    })

    test.each([
      { body: {}, message: 'elementTree must be defined' },
      { body: { elementTree: {} }, message: 'replacementContext must be defined' },
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

    test('performs requested element tree replacement', async () => {
      // Arrange
      const { testApiRequest } = fixture()

      // Act
      const { statusCode, jsonBody } = await testApiRequest({
        method: 'POST',
        path: PATH,
        body: {
          elementTree,
          replacementContext: {
            swatchIds: {
              'U3dhdGNoOjkzYTcxNjk1LWI5ZGEtNDExNC04NGM1LWMzYjBmM2RlY2U3NA==':
                '[replaced-swatch-id-1]',
              'U3dhdGNoOjJkN2FkYjMwLWNkZTItNDI2NS1hN2Q0LTY3ZTkzNTg2ODMxMg==':
                '[replaced-swatch-id-2]',
            },
            fileIds: {
              'RmlsZToxMDZjODJlNC03ZmEzLTQwOGQtYmVhNy04Zjk1N2IzMDlkZTY=': '[replaced-file-id-1]',
            },
            typographyIds: {
              'VHlwb2dyYXBoeToyYTk5ZTk2NS02OWIzLTQ0YjgtOTdkMS05MmM0ODM4YmUwZTc=':
                '[replaced-typography-id-1]',
            },
            pageIds: {
              'UGFnZTpmNTljNGNjNy1mZDhkLTRkZjUtYjM1Yi00NzFhOWViNWMyNjg=': '[replaced-page-id-1]',
            },
          },
        },
      })

      // Assert
      expect(statusCode).toBe(200)
      expect(await jsonBody).toMatchSnapshot('element tree replacement')
    })
  })
})
