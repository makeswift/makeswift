import {
  serializeObject,
  deserializeObject,
  type Deserialized,
} from './object-serialization'

expect.addSnapshotSerializer({
  serialize: () => '[MessagePort]',
  test: (value) => value instanceof MessagePort,
})

describe('object serialization', () => {
  test('Deserialized', () => {
    const obj = {
      label: 'hello',
      getItemLabel: (item: { label: string }) => item.label,
    }

    const deserialized: Deserialized<typeof obj> = {
      label: 'hello',
      getItemLabel: async (item: { label: string }) => item.label,
    }

    expect(deserialized.getItemLabel).toMatchSnapshot()
  })

  describe.each([
    {},
    { label: undefined },
    { label: 'visible', defaultValue: true },
    { label: 'visible', options: [{ label: 'one', value: 1 }] },
  ])('%o', (object) => {
    test('should serialize to itself', () => {
      expect(serializeObject(object)).toEqual([object, []])
    })

    test('should deserialize to itself', () => {
      const [serialized, _] = serializeObject(object)
      expect(deserializeObject(serialized)).toEqual(object)
    })
  })

  describe.each([
    { getItemLabel: (item: any) => item.label },
    { arrayOfFunctions: [(item: any) => item.label] },
  ])('%o', (object) => {
    test('should handle function serialization', async () => {
      const [serialized, transferables] = serializeObject(object)
      expect(transferables).toHaveLength(1)
      expect(transferables[0]).toBeInstanceOf(MessagePort)
      transferables.forEach((port: any) => port.close())

      expect(serialized).toMatchSnapshot()
    })

    test('should deserialize serialized functions', () => {
      const [serialized, transferables] = serializeObject(object)
      transferables.forEach((port: any) => port.close())
      expect(deserializeObject(serialized)).toMatchSnapshot()
    })
  })
})
