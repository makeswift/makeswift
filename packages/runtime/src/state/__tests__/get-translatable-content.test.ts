import type { DeserializedRecord, DeserializedFunction, AnyFunction } from '@makeswift/controls'
import { getTranslatableContent } from '../translations/get'
import { translatableContentSampleElementTree } from './fixtures/translatable-content-sample'
import { serializedDescriptorsFromDb } from './fixtures/serialized-descriptors-from-db'
import { DescriptorsByComponentType, DescriptorsByProp } from '../modules/prop-controllers'
import { deserializeControls } from '../../builder/serialization/control-serialization'

const descriptors = serializedDescriptorsFromDb;

const textElementKey1 = 'd9cb4bc3-9a21-43cc-b300-9aa896c3672d'
const textElementKey2 = '10529c61-6d2c-4724-966a-c8ae579df487'
const buttonReadMoreKey = 'beef2474-13dd-4df5-8b63-89a79b3e59f6'
const buttonBuyNowKey = 'a254c640-ff21-406b-bffc-b9e95157a538'

const BACKEND_FUNCTION_SLOT_KEYS = new Set(['getValue', 'onChange', 'getStyle'])

function isEmptyObject(value: unknown): value is Record<string, never> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  )
}

const noopAsyncFunction = async (): Promise<undefined> => undefined

function stubEmptyObjectFunctionSlotsRec(value: unknown): unknown {
  if (value === null || typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map(stubEmptyObjectFunctionSlotsRec)
  const obj = value as Record<string, unknown>
  return Object.fromEntries(
    Object.entries(obj).map(([key, v]) => {
      if (BACKEND_FUNCTION_SLOT_KEYS.has(key) && isEmptyObject(v)) {
        return [key, noopAsyncFunction as DeserializedFunction<AnyFunction>]
      }
      return [key, stubEmptyObjectFunctionSlotsRec(v)]
    }),
  )
}

function stubEmptyObjectFunctionSlotsForBackend(
  record: DeserializedRecord,
): DeserializedRecord {
  return stubEmptyObjectFunctionSlotsRec(record) as DeserializedRecord
}

const deserializeDescriptors = (
  descriptors: Record<string, Record<string, unknown>>,
): DescriptorsByComponentType => {
  const serialized = descriptors
  const resolved: DescriptorsByComponentType = new Map()
  for (const [componentType, propSerialized] of Object.entries(serialized)) {
    resolved.set(componentType, deserializeControls(propSerialized, {
      recordPreprocessor: stubEmptyObjectFunctionSlotsForBackend,
    }) as DescriptorsByProp)
  }
  return resolved
}

describe('getTranslatableContent', () => {
  test('extracts translatable data from an element tree using persisted descriptors', () => {
    const result = getTranslatableContent(
      deserializeDescriptors(descriptors),
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
