import { AnyFunction } from './function'
import {
  deserializeObject,
  SerializationPlugin,
  serializeObject,
  type Deserialized,
} from './object-serialization'

const mockSerializeFunctionPlugin: SerializationPlugin<AnyFunction> = {
  match: (val: unknown) => typeof val === 'function',
  serialize: jest.fn(() => `[SerializedFunction]`),
}

const mockSerializeSerializableObjectPlugin: SerializationPlugin<SerializableObject> =
  {
    match: (val: unknown) => val instanceof SerializableObject,
    serialize: jest.fn((def) => def.serialize()),
  }

class SerializableObject {
  constructor(private readonly obj: { type: string; [key: string]: any }) {}

  serialize(): unknown {
    return serializeObject(this.obj, [
      mockSerializeFunctionPlugin,
      mockSerializeSerializableObjectPlugin,
    ])
  }
}

afterEach(() => {
  jest.clearAllMocks()
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
      expect(serializeObject(object)).toEqual(object)
    })

    test('should deserialize to itself', () => {
      const serialized = serializeObject(object)
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

    const serialized = serializeObject(object, [
      mockSerializeFunctionPlugin,
      mockSerializeSerializableObjectPlugin,
    ])
    expect(mockSerializeFunctionPlugin.serialize).toHaveBeenCalledTimes(3)
    expect(serialized).toMatchSnapshot()
  })

  describe.each([
    { getItemLabel: (item: any) => item.label },
    { arrayOfFunctions: [(item: any) => item.label] },
  ])('%o', (object) => {
    test('should handle function serialization', async () => {
      const serialized = serializeObject(object, [
        mockSerializeFunctionPlugin,
        mockSerializeSerializableObjectPlugin,
      ])
      expect(serialized).toMatchSnapshot()
    })

    test('should deserialize serialized functions', () => {
      const serialized = serializeObject(object)
      expect(deserializeObject(serialized)).toMatchSnapshot()
    })
  })
})
