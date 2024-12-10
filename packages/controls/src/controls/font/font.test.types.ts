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
  fontStyle: string
  fontWeight: number
}

describe('Font Types', () => {
  test('infers types from control definition (without variants / default passed)', () => {
    const def = Font({
      label: 'test',
      variant: false,
      defaultValue: {
        fontFamily: 'Spline Sans',
      },
    })

    type Config = typeof def.config
    expectTypeOf<Config>().toEqualTypeOf<{
      label?: string
      defaultValue: ExpectedValueWithoutVariantsType
      variant?: boolean
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

  test('infers types from control definition (without variants / no default)', () => {
    const def = Font({
      variant: false,
    })

    type Config = typeof def.config
    expectTypeOf<Config>().toEqualTypeOf<{
      label?: string
      defaultValue?: ExpectedValueWithoutVariantsType
      variant?: boolean
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

  test('infers types from control definition (with variants / default passed)', () => {
    const def = Font({
      label: 'test',
      variant: true as const,
      defaultValue: {
        fontFamily: 'Spline Sans',
        fontWeight: 400,
        fontStyle: 'normal',
      },
    })

    type Config = typeof def.config
    expectTypeOf<Config>().toEqualTypeOf<{
      label?: string
      defaultValue: ExpectedValueWithVariantsType
      variant?: boolean
    }>()

    type a = typeof def
    type b = DataType<
      FontDefinition<{
        defaultValue: {
          fontFamily: string
          fontStyle: string
          fontWeight: number
        }
        label?: string | undefined
        variant?: true
      }>
    >
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

  test('infers types from control definition (with variants / no default)', () => {
    const def = Font()

    type Config = typeof def.config
    expectTypeOf<Config>().toEqualTypeOf<{
      label?: string
      defaultValue?: ExpectedValueWithVariantsType
      variant?: boolean
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
})
