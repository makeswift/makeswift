import { HttpResponse } from 'msw'
import { failedResponseBody } from '../client'

describe('failedResponseBody', () => {
  test('returns JSON for JSON responses', async () => {
    // Arrange
    const response = HttpResponse.json(
      { error: 'Bad Request', message: 'Invalid swatch ID', status: 400 },
      { status: 400 },
    )

    // Act
    const result = await failedResponseBody(response)

    // Assert
    expect(result).toStrictEqual({
      error: 'Bad Request',
      message: 'Invalid swatch ID',
      status: 400,
    })
  })

  test('returns text for XML responses', async () => {
    // Arrange
    const response = HttpResponse.xml('<error>Internal server error</error>', { status: 500 })

    // Act
    const result = await failedResponseBody(response)

    // Assert
    expect(result).toEqual('<error>Internal server error</error>')
  })

  test('returns text for text responses', async () => {
    // Arrange
    const response = HttpResponse.text('Unauthorized', { status: 401 })

    // Act
    const result = await failedResponseBody(response)

    // Assert
    expect(result).toEqual('Unauthorized')
  })

  test('gracefully handles the failure to extract response body', async () => {
    // Arrange
    const response = {
      text: () => Promise.reject('Connection reset'),
    } as any

    // Act
    const result = await failedResponseBody(response)

    // Assert
    expect(result).toEqual('Failed to extract response body: Connection reset')
  })
})
