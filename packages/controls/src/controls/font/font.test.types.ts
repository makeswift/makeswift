import { expectTypeOf } from 'expect-type'

import { ControlDataTypeKey } from '../../common'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../associated-types'

import { Font, FontDefinition } from './font'

type ExpectedValueWithoutVariantsType = {
  fontFamily: string
}

type ExpectedValueWithVariantsType = {
  fontFamily: string
  fontStyle: 'normal' | 'italic'
  fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
}

describe('Font Types', () => {
  test('infers types from control function (without variants / default passed)', () => {
    const def = Font({
      label: 'label',
      variant: false,
      defaultValue: {
        fontFamily: 'Spline Sans',
      },
    })

    type Config = typeof def.config
    expectTypeOf<Config>().toEqualTypeOf<{
      label?: string
      description?: string
      defaultValue: ExpectedValueWithoutVariantsType
      variant: false
    }>()

    type Data = DataType<typeof def>
    expectTypeOf<Data>().toEqualTypeOf<{
      [ControlDataTypeKey]: 'font::v1'
      value: ExpectedValueWithoutVariantsType
    }>()

    type Value = ValueType<typeof def>
    expectTypeOf<Value>().toEqualTypeOf<ExpectedValueWithoutVariantsType>()

    type Resolved = ResolvedValueType<typeof def>
    expectTypeOf<Resolved>().toEqualTypeOf<ExpectedValueWithoutVariantsType>()
  })

  test('infers types from control function (without variants / no default)', () => {
    const def = Font({
      variant: false,
    })

    type Config = typeof def.config
    expectTypeOf<Config>().toEqualTypeOf<{
      label?: string
      description?: string
      defaultValue?: ExpectedValueWithoutVariantsType
      variant: false
    }>()

    type Data = DataType<typeof def>
    expectTypeOf<Data>().toEqualTypeOf<
      | {
          [ControlDataTypeKey]: 'font::v1'
          value: ExpectedValueWithoutVariantsType
        }
      | undefined
    >()

    type Value = ValueType<typeof def>
    expectTypeOf<Value>().toEqualTypeOf<
      ExpectedValueWithoutVariantsType | undefined
    >()

    type Resolved = ResolvedValueType<typeof def>
    expectTypeOf<Resolved>().toEqualTypeOf<
      ExpectedValueWithoutVariantsType | undefined
    >()
  })

  test('infers types from control function (with variants / default passed)', () => {
    const def = Font({
      label: 'test',
      variant: true,
      defaultValue: {
        fontFamily: 'Spline Sans',
        fontWeight: 400,
        fontStyle: 'normal',
      },
    })

    type Config = typeof def.config
    expectTypeOf<Config>().toEqualTypeOf<{
      label?: string
      description?: string
      defaultValue: ExpectedValueWithVariantsType
      variant: true
    }>()

    type Data = DataType<typeof def>
    expectTypeOf<Data>().toEqualTypeOf<{
      [ControlDataTypeKey]: 'font::v1'
      value: ExpectedValueWithVariantsType
    }>()

    type Value = ValueType<typeof def>
    expectTypeOf<Value>().toEqualTypeOf<ExpectedValueWithVariantsType>()

    type Resolved = ResolvedValueType<typeof def>
    expectTypeOf<Resolved>().toEqualTypeOf<ExpectedValueWithVariantsType>()
  })

  test('infers types from control function (with variants / no default)', () => {
    const def = Font()

    type Config = typeof def.config
    expectTypeOf<Config>().toEqualTypeOf<{
      label?: string
      description?: string
      defaultValue?: ExpectedValueWithVariantsType
      variant: true
    }>()

    type Data = DataType<typeof def>
    expectTypeOf<Data>().toEqualTypeOf<
      | {
          [ControlDataTypeKey]: 'font::v1'
          value: ExpectedValueWithVariantsType
        }
      | undefined
    >()

    type Value = ValueType<typeof def>
    expectTypeOf<Value>().toEqualTypeOf<
      ExpectedValueWithVariantsType | undefined
    >()

    type Resolved = ResolvedValueType<typeof def>
    expectTypeOf<Resolved>().toEqualTypeOf<
      ExpectedValueWithVariantsType | undefined
    >()
  })

  test('infers types from control definition', () => {
    type def = FontDefinition

    type Data = DataType<def>
    expectTypeOf<Data>().toEqualTypeOf<
      | {
          [ControlDataTypeKey]: 'font::v1'
          value: ExpectedValueWithoutVariantsType
        }
      | {
          [ControlDataTypeKey]: 'font::v1'
          value: ExpectedValueWithVariantsType
        }
      | undefined
    >()

    type Value = ValueType<def>
    expectTypeOf<Value>().toEqualTypeOf<
      | ExpectedValueWithVariantsType
      | ExpectedValueWithoutVariantsType
      | undefined
    >()

    type Resolved = ResolvedValueType<def>
    expectTypeOf<Resolved>().toEqualTypeOf<
      | ExpectedValueWithVariantsType
      | ExpectedValueWithoutVariantsType
      | undefined
    >()
  })
})
