import { expectTypeOf } from 'expect-type'

import { ControlDataTypeKey } from '../../../common'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../../associated-types'
import { Color } from '../../color'
import { List } from '../../list'
import { Number } from '../../number'

import { Shape } from './shape'

describe('Shape Types', () => {
  describe('infers types from control definitions', () => {
    test('Shape {Color, List<Number>}', () => {
      const colorDef = Color({ label: 'Color' })
      const numberListDef = List({ type: Number({ defaultValue: 0 }) })

      const colorFn = () => colorDef
      const listFn = () => numberListDef

      const def = Shape({
        type: {
          color: colorDef,
          list: List({
            type: Number({ defaultValue: 0 }),
          }),
        },
      })

      type Config = typeof def.config

      expectTypeOf<Config>().toEqualTypeOf<{
        readonly type: {
          color: ReturnType<typeof colorFn>
          list: ReturnType<typeof listFn>
        }
      }>()

      type Data = DataType<typeof def>

      expectTypeOf<Data>().toEqualTypeOf<{
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
      }>()

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
})
