import {
  deserializeObject,
  Serializable,
  serializeObject,
  type Deserialized,
} from './object-serialization'
import { type SerializedRecord } from './types'

expect.addSnapshotSerializer({
  serialize: () => '[MessagePort]',
  test: (value) => value instanceof MessagePort,
})

class SerializableObject extends Serializable {
  constructor(private readonly obj: { type: string; [key: string]: any }) {
    super()
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serializeObject(this.obj) as [SerializedRecord, Transferable[]]
  }
}

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

  test('should correctly serialize nested Serializables', () => {
    const object = {
      item: new SerializableObject({
        type: 'item',
        getItemLabel: (item: any) => item.label,
        subitems: [
          new SerializableObject({
            type: 'subitem 1',
            arrayOfFunctions: [(item: any) => item.label],
          }),
          new SerializableObject({
            type: 'subitem 2',
            getItemLabel: (item: any) => item.label,
          }),
        ],
      }),
    }

    const [serialized, transferables] = serializeObject(object)
    expect(transferables).toHaveLength(3)
    expect(transferables[0]).toBeInstanceOf(MessagePort)
    transferables.forEach((port: any) => port.close())

    expect(serialized).toMatchSnapshot()
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
