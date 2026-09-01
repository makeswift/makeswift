import { expectTypeOf } from 'expect-type'

import { ControlDataTypeKey } from '../../common'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../associated-types'
import { unstable_ContextValue } from '../context-value'

import { Checkbox } from './checkbox'

type ExpectedCheckboxDataType =
  | boolean
  | {
      [ControlDataTypeKey]: 'checkbox::v1'
      value: boolean
    }

describe('Checkbox Types', () => {
  test('infers types from control definitions (default passed)', () => {
    const def = Checkbox({ label: 'test', defaultValue: true })

    type ConfigType = typeof def.config

    expectTypeOf<ConfigType>().toEqualTypeOf<{
      label?: string
      description?: string
      defaultValue: boolean
      provides?: undefined
    }>()

    type Data = DataType<typeof def>
    expectTypeOf<Data>().toEqualTypeOf<ExpectedCheckboxDataType>()

    type Value = ValueType<typeof def>
    expectTypeOf<Value>().toEqualTypeOf<boolean>()

    type Resolved = ResolvedValueType<typeof def>
    expectTypeOf<Resolved>().toEqualTypeOf<boolean>()
  })

  test('infers types from control definitions (no default)', () => {
    const def = Checkbox()

    type ConfigType = typeof def.config
    expectTypeOf<ConfigType>().toEqualTypeOf<{
      label?: string
      description?: string
      defaultValue?: boolean
      provides?: undefined
    }>()

    type Data = DataType<typeof def>
    expectTypeOf<Data>().toEqualTypeOf<ExpectedCheckboxDataType | undefined>()

    type Value = ValueType<typeof def>
    expectTypeOf<Value>().toEqualTypeOf<boolean | undefined>()

    type Resolved = ResolvedValueType<typeof def>

    expectTypeOf<Resolved>().toEqualTypeOf<boolean | undefined>()
  })

  test('infers types from control definitions (provided context)', () => {
    const checkedContext = unstable_ContextValue('checked').ofType<boolean>()
    const def = Checkbox({ defaultValue: true, provides: checkedContext })

    type ConfigType = typeof def.config
    expectTypeOf<ConfigType>().toEqualTypeOf<{
      label?: string
      description?: string
      defaultValue: boolean
      provides?: typeof checkedContext
    }>()
  })
})
