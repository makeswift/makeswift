import { apiRequestFixtures } from './test-utils'
import * as makeswiftClient from '../client'
import { RestApiClientError } from '../../api/rest-api-client'

const PATH = '/api/makeswift/table-records'

const createTableRecord = jest.fn()

jest.mock('../client', () => ({
  Makeswift: jest.fn(),
}))

beforeEach(() => {
  jest.mocked(makeswiftClient.Makeswift).mockReturnValue({
    createTableRecord,
  } as any)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('MakeswiftApiHandler', () => {
  describe.each(apiRequestFixtures)('[$router router] ${PATH}', ({ fixture }) => {
    test('does not require authentication', async () => {
      // Arrange
      const { testApiRequest } = fixture()
      createTableRecord.mockResolvedValue(undefined)

      // Act
      const { statusCode } = await testApiRequest({
        method: 'POST',
        path: PATH,
        body: { tableId: 'my-table', columns: [{ columnId: 'my-column', data: 'my-data' }] },
      })

      // Assert
      expect(statusCode).toBe(204)
    })

    test.each([
      { body: {}, message: 'tableId must be a string' },
      { body: { tableId: 'my-table' }, message: 'columns must be an array' },
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
      expect(createTableRecord).not.toHaveBeenCalled()
    })

    test('creates a table record for the given table', async () => {
      // Arrange
      const { testApiRequest } = fixture()
      createTableRecord.mockResolvedValue(undefined)
      const columns = [{ columnId: 'my-column', data: 'my-data' }]

      // Act
      const { statusCode } = await testApiRequest({
        method: 'POST',
        path: PATH,
        body: { tableId: 'my-table', columns },
      })

      // Assert
      expect(statusCode).toBe(204)
      expect(createTableRecord).toHaveBeenCalledWith('my-table', columns)
    })

    test('propagates the upstream status code on failure', async () => {
      // Arrange
      const { testApiRequest } = fixture()
      createTableRecord.mockRejectedValue(
        new RestApiClientError(
          'Failed to create table record',
          new Response(null, { status: 404 }),
          {},
        ),
      )

      // Act
      const { statusCode, jsonBody } = await testApiRequest({
        method: 'POST',
        path: PATH,
        body: { tableId: 'my-table', columns: [] },
      })

      // Assert
      expect(statusCode).toBe(404)
      expect(await jsonBody).toEqual({ message: 'Failed to create table record: 404 ' })
    })
  })
})
