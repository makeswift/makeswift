import { TextArea } from './text-area'
import {
  type DataType,
  type ValueType,
  type ResolvedValueType,
} from '../control-definition'
import { expectTypeOf } from 'expect-type'
import { ControlDataTypeKey } from '../common'

type ExpectedTextAreaDataType =
  | string
  | {
      [ControlDataTypeKey]: 'text-area::v1'
      value: string
    }

describe('TextArea Types', () => {
  describe('infers types from control definitions', () => {
    test('empty config', () => {
      const def = TextArea()

      type Config = typeof def.config
      expectTypeOf<Config>().toEqualTypeOf<{
        label?: string
        defaultValue?: string
        rows?: number
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<ExpectedTextAreaDataType | undefined>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<string | undefined>

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<string | undefined>
    })

    test('defaultValue provided', () => {
      const def = TextArea({ defaultValue: 'test' })

      type Config = typeof def.config
      expectTypeOf<Config>().toEqualTypeOf<{
        defaultValue: string
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<ExpectedTextAreaDataType | undefined>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<string>

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<string>
    })
  })
})
