import { serializeConfig, deserializeConfig } from './config-serialization'

expect.addSnapshotSerializer({
  serialize: () => '[MessagePort]',
  test: (value) => value instanceof MessagePort,
})

describe('config serialization', () => {
  describe.each([
    {},
    { label: undefined },
    { label: 'visible', defaultValue: true },
    { label: 'visible', options: [{ label: 'one', value: 1 }] },
  ])('%o', (config) => {
    test('should serialize to itself', () => {
      expect(serializeConfig(config)).toEqual([config, []])
    })

    test('should deserialize to itself', () => {
      const [serialized, _] = serializeConfig(config)
      expect(deserializeConfig(serialized)).toEqual(config)
    })
  })

  describe.each([
    { getItemLabel: (item: any) => item.label },
    { arrayOfFunctions: [(item: any) => item.label] },
  ])('%o', (config) => {
    test('should handle function serialization', async () => {
      const [serialized, transferables] = serializeConfig(config)
      expect(transferables).toHaveLength(1)
      expect(transferables[0]).toBeInstanceOf(MessagePort)
      transferables.forEach((port: any) => port.close())

      expect(serialized).toMatchSnapshot()
    })

    test('should deserialize serialized functions', () => {
      const [serialized, transferables] = serializeConfig(config)
      transferables.forEach((port: any) => port.close())
      expect(deserializeConfig(serialized)).toMatchSnapshot()
    })
  })
})
