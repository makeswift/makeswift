import { expectTypeOf } from 'expect-type'

import { ControlDataTypeKey } from '../../common'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../associated-types'

import { Font } from './font'

type ExpectedValueType = {
  fontFamily: string
  fontStyle: string
  fontWeight: number
}

describe('Font Types', () => {
  test('infers types from control definition (default passed)', () => {
    const def = Font({
      label: 'test',
      defaultValue: {
        fontFamily: 'Spline Sans',
        fontWeight: 400,
        fontStyle: 'normal',
      },
    })

    type Config = typeof def.config
    expectTypeOf<Config>().toEqualTypeOf<{
      label?: string
      defaultValue: ExpectedValueType
    }>()

    type Data = DataType<typeof def>
    expectTypeOf<Data>().toEqualTypeOf<{
      [ControlDataTypeKey]: 'font::v1'
      value: ExpectedValueType
    }>()

    type Value = ValueType<typeof def>
    expectTypeOf<Value>().toEqualTypeOf<ExpectedValueType>()

    type Resolved = ResolvedValueType<typeof def>
    expectTypeOf<Resolved>().toEqualTypeOf<ExpectedValueType>()
  })

  test('infers types from control definition (no default)', () => {
    const def = Font()

    type Config = typeof def.config
    expectTypeOf<Config>().toEqualTypeOf<{
      label?: string
      defaultValue?: ExpectedValueType
    }>()

    type Data = DataType<typeof def>
    expectTypeOf<Data>().toEqualTypeOf<
      | {
          [ControlDataTypeKey]: 'font::v1'
          value: ExpectedValueType
        }
      | undefined
    >()

    type Value = ValueType<typeof def>
    expectTypeOf<Value>().toEqualTypeOf<ExpectedValueType | undefined>()

    type Resolved = ResolvedValueType<typeof def>
    expectTypeOf<Resolved>().toEqualTypeOf<ExpectedValueType | undefined>()
  })
})
