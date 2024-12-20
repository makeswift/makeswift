import { expectTypeOf } from 'expect-type'

import { ControlDataTypeKey } from '../../common'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../associated-types'
import { Color } from '../color'
import { List } from '../list'
import { Number } from '../number'

import { ShapeV2, ShapeV2Definition } from './shape-v2'

type ExpectedShapeDataType = {
  color: {
    swatchId: string
    alpha: number
    [ControlDataTypeKey]?: 'color::v1'
  }
  list: {
    id: string
    type?: string
    value:
      | number
      | {
          [ControlDataTypeKey]: 'number::v1'
          value: number
        }
  }[]
}

describe('ShapeV2 Types', () => {
  describe('infers types from control function', () => {
    test('ShapeV2 {Color, List<Number>}', () => {
      const colorDef = Color()
      const numberListDef = List({ type: Number({ defaultValue: 0 }) })

      const colorFn = () => colorDef
      const listFn = () => numberListDef

      const def = ShapeV2({
        label: 'Group',
        layout: ShapeV2.Layout.Popover,
        type: {
          color: Color(),
          list: List({
            type: Number({ defaultValue: 0 }),
          }),
        },
      })

      type Config = typeof def.config

      // Something about using expectTypeOf on the entire config causes a strange typescript error.
      // The type of `label` changes when `type` is included.
      // We are individually testing different overlapping subsets to work around this.
      type ConfigWithoutType = Omit<Config, 'type'>
      expectTypeOf<ConfigWithoutType>().toEqualTypeOf<{
        label?: string | undefined
        layout?: typeof ShapeV2.Layout.Popover | typeof ShapeV2.Layout.Inline
      }>()

      type ConfigWithoutLabel = Omit<Config, 'label'>
      expectTypeOf<ConfigWithoutLabel>().toEqualTypeOf<{
        layout?: typeof ShapeV2.Layout.Popover | typeof ShapeV2.Layout.Inline
        readonly type: {
          color: ReturnType<typeof colorFn>
          list: ReturnType<typeof listFn>
        }
      }>()

      type Data = DataType<typeof def>

      expectTypeOf<Data>().toEqualTypeOf<
        | {
            [ControlDataTypeKey]: 'shape-v2::v1'
            value: ExpectedShapeDataType
          }
        | ExpectedShapeDataType
      >()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<{
        color: { swatchId: string; alpha: number }
        list: number[]
      }>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<{
        color: string | undefined
        list: number[]
      }>()
    })
  })

  test('infers types from control definition', () => {
    type def = ShapeV2Definition

    type Data = DataType<def>
    expectTypeOf<Data>().toEqualTypeOf<
      | {
          [ControlDataTypeKey]: 'shape-v2::v1'
          value: { [key: string]: any }
        }
      | { [key: string]: any }
    >()

    type Value = ValueType<def>
    expectTypeOf<Value>().toEqualTypeOf<{ [key: string]: any }>()

    type Resolved = ResolvedValueType<def>
    expectTypeOf<Resolved>().toEqualTypeOf<{ [key: string]: any }>()
  })
})
