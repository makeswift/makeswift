import {
  deserializeFunction,
  isSerializedFunction,
  serializeFunction,
} from './function-serialization'

describe('serializeFunction & deserializeFunction', () => {
  test('simple call', async () => {
    // Arrange
    const add = deserializeFunction(serializeFunction((a, b) => a + b))

    // Act
    const result = await add(2, 2)

    // Assert
    expect(result).toBe(4)
  })

  test('multiple synchronous calls', async () => {
    // Arrange
    const add = deserializeFunction(serializeFunction((a, b) => a + b))

    // Act
    const results = await Promise.all(Array.from({ length: 5 }, (_, i) => add(1, i)))

    // Assert
    expect(results).toEqual([1, 2, 3, 4, 5])
  })
})

describe('isSerializedFunction', () => {
  test('trivial case', () => {
    // Arrange
    const add = serializeFunction((a, b) => a + b)

    // Act
    const result = isSerializedFunction(add)

    // Assert
    expect(result).toBe(true)
  })

  test('false positive', () => {
    // Arrange
    const add = (a: number, b: number) => a + b

    // Act
    const result = isSerializedFunction(add)

    // Assert
    expect(result).toBe(false)
  })
})
