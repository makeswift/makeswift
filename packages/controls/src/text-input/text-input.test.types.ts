import { TextInput } from './text-input'
import {
  type DataType,
  type ValueType,
  type ResolvedValueType,
} from '../control-definition'
import { expectTypeOf } from 'expect-type'
import { ControlDataTypeKey } from '../common'

type ExpectedTextInputDataType =
  | string
  | {
      [ControlDataTypeKey]: 'text-input::v1'
      value: string
    }

describe('TextInput Types', () => {
  describe('infers types from control definitions', () => {
    test('empty config', () => {
      const def = TextInput()

      type Config = typeof def.config
      expectTypeOf<Config>().toEqualTypeOf<{
        label?: string
        defaultValue?: string
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<
        ExpectedTextInputDataType | undefined
      >()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<string | undefined>

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<string | undefined>
    })

    test('defaultValue provided', () => {
      const def = TextInput({ defaultValue: 'test' })

      type Config = typeof def.config
      expectTypeOf<Config>().toEqualTypeOf<{
        defaultValue: string
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<
        ExpectedTextInputDataType | undefined
      >()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<string>

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<string>
    })
  })
})
