import { errorMessage } from '../error-message'

describe('errorMessage', () => {
  test.each([
    [undefined, 'Unknown error'],
    [null, 'Unknown error'],
    [{}, 'Unknown error'],
    [17, 'Unknown error'],
    ['Error string', 'Error string'],
    [{ message: 'Error message' }, 'Error message'],
    [new Error('Error message'), 'Error message'],
  ])('%s -> %s', (input, message) => {
    expect(errorMessage(input)).toBe(message)
  })
})
