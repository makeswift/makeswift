import { getTranslatableContent } from '../translations/get'
import { translatableContentSampleElementTree } from './fixtures/translatable-content-sample'
import { serializedDescriptorsFromDb } from './fixtures/serialized-descriptors-from-db'
import { DescriptorsByComponentType, DescriptorsByProp } from '../modules/prop-controllers'
import { deserializeControls } from '../../builder/serialization/control-serialization'

const descriptors = serializedDescriptorsFromDb;

const buttonReadMoreKey = 'beef2474-13dd-4df5-8b63-89a79b3e59f6'
const buttonBuyNowKey = 'a254c640-ff21-406b-bffc-b9e95157a538'

const deserializeDescriptors = (
  descriptors: Record<string, Record<string, unknown>>,
): DescriptorsByComponentType => {
  const serialized = descriptors
  const resolved: DescriptorsByComponentType = new Map()
  for (const [componentType, propSerialized] of Object.entries(serialized)) {
    resolved.set(componentType, deserializeControls(propSerialized) as DescriptorsByProp)
  }
  return resolved
}

describe('getTranslatableContent', () => {
  test('extracts translatable data from an element tree using persisted descriptors', () => {
    const result = getTranslatableContent(
      deserializeDescriptors(descriptors),
      translatableContentSampleElementTree,
    )
    const readMoreData = result[`${buttonReadMoreKey}:children`] as { value?: string } | undefined
    const buyNowData = result[`${buttonBuyNowKey}:children`] as { value?: string } | undefined
    expect(readMoreData).toBeDefined()
    expect(readMoreData?.value).toBe('Read more')
    expect(buyNowData).toBeDefined()
    expect(buyNowData?.value).toBe('Buy now')

    expect(Object.keys(result)).toHaveLength(2)
  })
})
