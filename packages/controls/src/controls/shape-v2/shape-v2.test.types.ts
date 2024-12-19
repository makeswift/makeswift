import { expectTypeOf } from 'expect-type'

import { ControlDataTypeKey } from '../../common'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../associated-types'
import { Color, ColorDefinition } from '../color'
import { List, ListDefinition } from '../list'
import { Number, NumberDefinition } from '../number'

import { ShapeV2, ShapeV2Definition } from './shape-v2'

type ExpectedShapeDataType = {
  color?: {
    swatchId: string
    alpha: number
    [ControlDataTypeKey]?: 'color::v1'
  }
  list?: {
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

      expectTypeOf<Config>().toEqualTypeOf<{
        label?: string | undefined
        // todo: changing these types breaks something completely different
        // it breaks the same thing that breaks down below. The issue below is probably a red herring.
        // layout?: typeof ShapeV2.Layout.Popover
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
        color?: { swatchId: string; alpha: number }
        list?: number[]
      }>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<{
        color: string | undefined
        list: number[]
      }>()
    })
  })

  test('infers types from control definition', () => {
    type def = ShapeV2Definition<{
      type: {
        color: ColorDefinition
        list: ListDefinition<{ type: NumberDefinition }>
      }
      layout: typeof ShapeV2.Layout.Popover
    }>

    // @ts-expect-error
    type Data = DataType<def>
    // todo: the error here is likely a red herring. Look at the comment below
    // expectTypeOf<Data>().toEqualTypeOf<
    //   | {
    //       [ControlDataTypeKey]: 'shape-v2::v1'
    //       value: ExpectedShapeDataType
    //     }
    //   | ExpectedShapeDataType
    // >()

    type Value = ValueType<def>
    expectTypeOf<Value>().toEqualTypeOf<{
      color?: { swatchId: string; alpha: number }
      list?: (number | undefined)[]
    }>()

    type Resolved = ResolvedValueType<def>
    expectTypeOf<Resolved>().toEqualTypeOf<{
      color: string | undefined
      list: (number | undefined)[]
    }>()
  })
})
