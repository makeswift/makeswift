import { expectTypeOf } from 'expect-type'

import { Flatten } from '../../testing/util-types'

import { AcceptedTextDataTypes, ControlDataTypeKey } from '../../common'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../associated-types'

import { TextArea } from './text-area'

type ExpectedTextAreaDataType =
  | string
  | {
      [ControlDataTypeKey]: (typeof AcceptedTextDataTypes)[number]
      value: string
    }

describe('TextArea Types', () => {
  describe('infers types from control definitions', () => {
    test('empty config', () => {
      const def = TextArea()

      type Config = typeof def.config
      expectTypeOf<Flatten<Config>>().toEqualTypeOf<{
        label?: string
        description?: string
        defaultValue?: string
        rows?: number
        provides?: undefined
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
      expectTypeOf<Flatten<Config>>().toEqualTypeOf<{
        defaultValue: string
        label?: string
        description?: string
        rows?: number
        provides?: undefined
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<ExpectedTextAreaDataType>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<string>

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<string>
    })
  })
})
