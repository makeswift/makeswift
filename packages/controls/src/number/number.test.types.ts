import { Number } from './number'
import {
  type DataType,
  type ValueType,
  type ResolvedValueType,
} from '../control-definition'
import { expectTypeOf } from 'expect-type'
import { ControlDataTypeKey } from '../common'

type ExpectedNumberDataType =
  | number
  | {
      [ControlDataTypeKey]: 'number::v1'
      value: number
    }

describe('Number Types', () => {
  describe('infers types from control definitions', () => {
    test('empty config', () => {
      const def = Number()

      type Config = typeof def.config
      expectTypeOf<Config>().toEqualTypeOf<{
        label?: string
        labelOrientation?: 'horizontal' | 'vertical'
        defaultValue?: number
        min?: number
        max?: number
        step?: number
        suffix?: string
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<ExpectedNumberDataType | undefined>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<number | undefined>

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<number | undefined>
    })

    test('defaultValue provided', () => {
      const def = Number({ defaultValue: 4 })

      type Config = typeof def.config
      expectTypeOf<Config>().toEqualTypeOf<{
        defaultValue: number
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<ExpectedNumberDataType>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<number>

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<number>
    })
  })
})
