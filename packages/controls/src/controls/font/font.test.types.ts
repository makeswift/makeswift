import { expectTypeOf } from 'expect-type'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../associated-types'

import { Font } from './font'

describe('Font Types', () => {
  test('infers types from control definition', () => {
    const def = Font()

    type Config = typeof def.config
    expectTypeOf<Config>().toEqualTypeOf<unknown>()

    type Data = Exclude<DataType<typeof def>, undefined>
    expectTypeOf<Data>().toEqualTypeOf<{
      fontFamily: string
      fontStyle: string
      fontWeight: string
    }>()

    type Value = Exclude<ValueType<typeof def>, undefined>
    expectTypeOf<Value>().toEqualTypeOf<Data>()

    type Resolved = ResolvedValueType<typeof def>
    expectTypeOf<Resolved>().toEqualTypeOf<{
      fontFamily: string
      fontStyle: string
      fontWeight: string
    }>()
  })
})
