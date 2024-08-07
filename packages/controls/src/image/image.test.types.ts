import { expectTypeOf } from 'expect-type'
import { Image } from './image'
import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../control-definition'

type ExpectedDataType =
  | string
  | {
      type: 'makeswift-file'
      id: string
      version: 1
    }
  | {
      type: 'external-file'
      version: 1
      url: string
      width?: number | null | undefined
      height?: number | null | undefined
    }

type ExpectedValueType =
  | {
      type: 'makeswift-file'
      id: string
    }
  | {
      type: 'external-file'
      url: string
      width?: number | null | undefined
      height?: number | null | undefined
    }

describe('Image Types', () => {
  describe('infers types from control definitions', () => {
    test('empty config', () => {
      const def = Image()

      type Config = typeof def.config
      expectTypeOf<Config>().toEqualTypeOf<{
        label?: string
        format?: typeof Image.Format.URL | typeof Image.Format.WithDimensions
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<ExpectedDataType>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<ExpectedValueType>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<string | undefined>()
    })

    test('URL Format', () => {
      const def = Image({
        format: Image.Format.URL,
      })

      type Config = typeof def.config
      expectTypeOf<Config>().toEqualTypeOf<{
        format: typeof Image.Format.URL
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<ExpectedDataType>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<ExpectedValueType>

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<string | undefined>
    })

    test('Dimensions Format', () => {
      const def = Image({
        format: Image.Format.WithDimensions,
      })

      type Config = typeof def.config
      expectTypeOf<Config>().toEqualTypeOf<{
        format: typeof Image.Format.WithDimensions
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<ExpectedDataType>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<ExpectedValueType>

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<
        | {
            url: string
            dimensions: {
              height: number
              width: number
            }
          }
        | undefined
      >
    })
  })
})
