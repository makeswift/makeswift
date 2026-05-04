import { expectTypeOf } from 'expect-type'

import { ControlDataTypeKey } from '../../common'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../associated-types'

import { unstable_Code } from './code'

type ExpectedCodeDataType =
  | string
  | {
      [ControlDataTypeKey]: 'code::v1'
      value: string
    }

describe('Code Types', () => {
  describe('infers types from control definitions', () => {
    test('empty config', () => {
      const def = unstable_Code()

      type Config = typeof def.config
      expectTypeOf<Config>().toEqualTypeOf<{
        label?: string
        description?: string
        defaultValue?: string
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<ExpectedCodeDataType | undefined>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<string | undefined>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<{ value: string } | undefined>()
    })

    test('defaultValue provided', () => {
      const def = unstable_Code({ defaultValue: 'console.log("hi")' })

      type Config = typeof def.config
      expectTypeOf<Config>().toEqualTypeOf<{
        label?: string
        description?: string
        defaultValue: string
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<ExpectedCodeDataType>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<string>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<{ value: string }>()
    })
  })
})
