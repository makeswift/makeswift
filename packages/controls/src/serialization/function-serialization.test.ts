import {
  deserializeFunction,
  serializeFunction,
} from './function-serialization'

describe('function serialization', () => {
  test('correctly deserializes serialized function', async () => {
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
})
