import { expectTypeOf } from 'expect-type'

import { ControlDataTypeKey } from '../../common'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../associated-types'

import { Color } from './color'

describe('Color Types', () => {
  describe('infers types from control definition', () => {
    test('empty config', () => {
      const def = Color()

      type ConfigType = typeof def.config
      expectTypeOf<ConfigType>().toEqualTypeOf<{
        label?: string | undefined
        defaultValue?: string | undefined
        labelOrientation?: 'vertical' | 'horizontal'
        hideAlpha?: boolean | undefined
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<{
        swatchId: string
        alpha: number
        [ControlDataTypeKey]?: 'color::v1' | undefined
      }>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<{ swatchId: string; alpha: number }>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<string | undefined>()
    })

    test('with default', () => {
      const def = Color({ defaultValue: 'red', label: 'color' })

      type ConfigType = typeof def.config
      expectTypeOf<ConfigType>().toEqualTypeOf<{
        defaultValue: string
        label?: string | undefined
        labelOrientation?: 'vertical' | 'horizontal'
        hideAlpha?: boolean | undefined
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<{
        swatchId: string
        alpha: number
        [ControlDataTypeKey]?: 'color::v1' | undefined
      }>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<{ swatchId: string; alpha: number }>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<string>()
    })
  })
})
