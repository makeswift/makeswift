import { deserializeSiteVersion, serializeSiteVersion } from '.'

const TestTokens = {
  Valid:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYWtlc3dpZnQtcnVudGltZSIsImlhdCI6MTc1NDU5OTE0OSwiZXhwIjo0MTAyNDMyNzQ5LCJhdWQiOiJ0ZXN0Iiwic3ViIjoibWFrZXN3aWZ0LXJ1bnRpbWUifQ.-1BDOmEN1Q1QeKP7qfjPyAkrKRjb4q4qaqyhPBvMnhg',
  Expired:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYWtlc3dpZnQtcnVudGltZSIsImlhdCI6MTc1NDU5OTE0OSwiZXhwIjo5NDY2NzI3NDksImF1ZCI6InRlc3QiLCJzdWIiOiJtYWtlc3dpZnQtcnVudGltZSJ9.9g7b4GCupawp6TUI93FUB4KHD_eur9mW64jZeVqBf6s',
  InvalidPayload:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYWtlc3dpZnQtcnVudGltZSIsImlhdCI6MTc1NDU5OTE0OSwiZXhwIjpudWxsLCJhdWQiOiJ0ZXN0Iiwic3ViIjoibWFrZXN3aWZ0LXJ1bnRpbWUifQ.T4kCrEgdPF86lhA-x7QT36vLpkHQ84-l_rmg1KT4sTs',
}

let consoleErrorSpy: jest.SpyInstance

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  consoleErrorSpy.mockRestore()
})

describe('Site Version', () => {
  describe('serializeSiteVersion', () => {
    test('returns string serialized site version', () => {
      const serialized = serializeSiteVersion({
        version: 'test',
        token: TestTokens.Valid,
      })

      expect(typeof serialized).toBe('string')
      expect(serialized).toMatchSnapshot()
    })
  })

  describe('deserializeSiteVersion', () => {
    test('should deserialize a valid site version', () => {
      // Arrange
      const serializedVersion = serializeSiteVersion({
        version: 'test',
        token: TestTokens.Valid,
      })

      // Act
      const result = deserializeSiteVersion(serializedVersion)

      // Assert
      expect(result).toEqual({
        version: 'test',
        token: TestTokens.Valid,
      })
    })

    test('should return null for an invalid serialization', () => {
      // Act
      const result = deserializeSiteVersion('this-is-not-a-valid-serialization')

      // Assert
      expect(result).toBeNull()
    })

    test('should return null when site version token is expired', () => {
      // Arrange
      const serializedVersion = serializeSiteVersion({
        version: 'test',
        token: TestTokens.Expired,
      })

      // Act
      const result = deserializeSiteVersion(serializedVersion)

      // Assert
      expect(result).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith('Site version token is expired')
    })

    test('should return null for an invalid site version payload', () => {
      // Arrange
      // @ts-expect-error - Intentionally passing an invalid payload
      const serializedVersion = serializeSiteVersion({ version: 5, token: null })

      // Act
      const result = deserializeSiteVersion(serializedVersion)

      // Assert
      expect(result).toBeNull()
    })

    test('should return null for a site version with invalid token', () => {
      // Arrange
      const serializedVersion = serializeSiteVersion({
        version: 'test',
        token: 'not-a-valid-token',
      })

      // Act
      const result = deserializeSiteVersion(serializedVersion)

      // Assert
      expect(result).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid site version token')
    })

    test('should return null for a site version with invalid token payload', () => {
      // Arrange
      const serializedVersion = serializeSiteVersion({
        version: 'test',
        token: TestTokens.InvalidPayload,
      })

      // Act
      const result = deserializeSiteVersion(serializedVersion)

      // Assert
      expect(result).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid site version token')
    })
  })
})
