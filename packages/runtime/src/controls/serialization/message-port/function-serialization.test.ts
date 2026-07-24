import {
  deserializeFunction,
  serializeFunction,
  isSerializedFunction,
} from './function-serialization'

describe('function serialization', () => {
  describe('isSerializedFunction', () => {
    test('trivial case', () => {
      // Arrange
      const add = serializeFunction((a, b) => a + b)

      // Act
      const result = isSerializedFunction(add)

      // Assert
      expect(result).toBe(true)
      add.close()
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

  test('simple call', async () => {
    // Arrange
    const serialized = serializeFunction((a, b) => a + b)
    const add = deserializeFunction(serialized)

    // Act
    const result = await add(2, 2)

    // Assert
    expect(result).toBe(4)
    serialized.close()
  })

  test('multiple synchronous calls', async () => {
    // Arrange
    const serialized = serializeFunction((a, b) => a + b)
    const add = deserializeFunction(serialized)

    // Act
    const results = await Promise.all(Array.from({ length: 5 }, (_, i) => add(1, i)))

    // Assert
    expect(results).toEqual([1, 2, 3, 4, 5])
    serialized.close()
  })

  test('repeated deserialization', async () => {
    const getItemLabel = (item: { label: string }) => item.label
    const serialized = serializeFunction(getItemLabel)

    const deserialized1 = deserializeFunction(serialized)
    const deserialized2 = deserializeFunction(serialized)

    expect(await deserialized1({ label: 'label 1' })).toBe('label 1')
    expect(await deserialized1({ label: 'label 2' })).toBe('label 2')

    expect(await deserialized2({ label: 'label 1' })).toBe('label 1')
    expect(await deserialized2({ label: 'label 2' })).toBe('label 2')

    serialized.close()
  })

  test(
    'a thrown error rejects the caller instead of hanging',
    async () => {
      const serialized = serializeFunction(() => {
        throw new Error('boom')
      })
      const deserialized = deserializeFunction(serialized)

      await expect(deserialized()).rejects.toThrow('boom')
      serialized.close()
    },
    1000,
  )

  test(
    'a rejected async result rejects the caller instead of hanging',
    async () => {
      const serialized = serializeFunction(async () => {
        throw new Error('async boom')
      })
      const deserialized = deserializeFunction(serialized)

      await expect(deserialized()).rejects.toThrow('async boom')
      serialized.close()
    },
    1000,
  )

  test(
    'forwards a MessagePort nested in the result as a transferable',
    async () => {
      const inner = serializeFunction((a: number) => a + 1)
      const outer = serializeFunction(() => ({ port: inner }))
      const deserializedOuter = deserializeFunction(outer)

      const result = (await deserializedOuter()) as { port: MessagePort }
      expect(result.port).toBeInstanceOf(MessagePort)

      const deserializedInner = deserializeFunction(result.port as any)
      expect(await deserializedInner(41)).toBe(42)

      outer.close()
      inner.close()
      result.port.close()
    },
    1000,
  )
})
