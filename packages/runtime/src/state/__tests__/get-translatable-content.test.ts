import { getTranslatableContent } from '../translations/get'
import { translatableContentSampleElementTree } from './fixtures/translatable-content-sample'
import { mockedSerializedDescriptorsFromBuilder  as descriptors} from './fixtures/serialized-descriptors-from-builder'
import { DescriptorsByComponentType, DescriptorsByProp } from '../modules/prop-controllers'
import { deserializeControls } from '../../builder/serialization/control-serialization'
import { DeserializationPlugin, SerializationPlugin, serializeObject, AnyFunction } from '@makeswift/controls'
import { SerializedFunction, DeserializedFunction } from '../../builder/serialization/function-serialization'

const textElementKey1 = 'd9cb4bc3-9a21-43cc-b300-9aa896c3672d'
const textElementKey2 = '10529c61-6d2c-4724-966a-c8ae579df487'
const buttonReadMoreKey = 'beef2474-13dd-4df5-8b63-89a79b3e59f6'
const buttonBuyNowKey = 'a254c640-ff21-406b-bffc-b9e95157a538'

const messagePortToNoopAsyncFunction: DeserializationPlugin<
  SerializedFunction<AnyFunction>,
  DeserializedFunction<AnyFunction>
> = {
  match: (value: any) => typeof value === 'object' && value?.__serializedType === 'MessagePort',
  deserialize: _value => async (): Promise<undefined> => Promise.resolve(undefined),
}

const serializeMessagePort: SerializationPlugin<any> = {
  match: (value: any) => (value instanceof MessagePort),
  serialize: (_value: any) => ({__serializedType: 'MessagePort'}),
}

const deserializeDescriptors = (
  descriptors: Record<string, Record<string, unknown>>,
): DescriptorsByComponentType => {
  const resolved: DescriptorsByComponentType = new Map()
  for (const [componentType, propSerialized] of Object.entries(descriptors)) {
    resolved.set(componentType, deserializeControls(propSerialized, { plugins: [messagePortToNoopAsyncFunction]}) as DescriptorsByProp)
  }
  return resolved
}

describe('getTranslatableContent', () => {
  test('extracts translatable data from an element tree using persisted descriptors', () => {
    // NOTE: this is mocking the behavior that should happen in ORION to properly serialize the descriptors
    const serializedDescriptors = serializeObject(descriptors, [serializeMessagePort]) as Record<string, any>

    const serializedControl = serializedDescriptors["./components/Text/index.js"].text.config.plugins[0].control;
    expect(serializedControl.getValue.__serializedType).toBe('MessagePort')
    expect(serializedControl.onChange.__serializedType).toBe('MessagePort')

    const result = getTranslatableContent(
      deserializeDescriptors(serializedDescriptors),
      translatableContentSampleElementTree,
    )

    expect(result[`${textElementKey1}:text`]).toBeDefined()
    expect(JSON.stringify(result[`${textElementKey1}:text`])).toContain('D A K A R')

    expect(result[`${textElementKey2}:text`]).toBeDefined()
    expect(JSON.stringify(result[`${textElementKey2}:text`])).toContain(
      'Introducing the New Land Rover Defender Dakar',
    )

    const readMoreData = result[`${buttonReadMoreKey}:children`] as { value?: string } | undefined
    const buyNowData = result[`${buttonBuyNowKey}:children`] as { value?: string } | undefined
    expect(readMoreData).toBeDefined()
    expect(readMoreData?.value).toBe('Read more')
    expect(buyNowData).toBeDefined()
    expect(buyNowData?.value).toBe('Buy now')

    expect(Object.keys(result)).toHaveLength(4)
  })
})
