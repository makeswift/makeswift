import { expectTypeOf } from 'expect-type'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../associated-types'

import { unstable_Typography } from './typography'

describe('Typography Types', () => {
  test('infers types from control definition', () => {
    const def = unstable_Typography()

    type Config = typeof def.config
    expectTypeOf<Config>().toEqualTypeOf<unknown>()

    type Data = Exclude<DataType<typeof def>, undefined>
    expectTypeOf<Data>().toEqualTypeOf<{
      id?: string
      style: {
        value: {
          fontFamily?: string | null
          lineHeight?: number | null
          letterSpacing?: number | null
          fontWeight?: number | null
          textAlign?: string | null
          uppercase?: boolean | null
          underline?: boolean | null
          strikethrough?: boolean | null
          italic?: boolean | null
          fontSize?: { value: number | null; unit: string | null } | null
          color?: { swatchId: string | null; alpha: number | null } | null
        }
        deviceId: string
      }[]
    }>()

    type Value = Exclude<ValueType<typeof def>, undefined>
    expectTypeOf<Value>().toEqualTypeOf<Data>()

    type Resolved = ResolvedValueType<typeof def>
    expectTypeOf<Resolved>().toEqualTypeOf<string>()
  })
})
