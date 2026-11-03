import { expectTypeOf } from 'expect-type'

import { ControlDataTypeKey } from '../../common'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../associated-types'
import { Color } from '../color'

import { List } from './'

type ExpectedColorData =
  | {
      type: 'swatch'
      swatchId: string
      alpha: number
      [ControlDataTypeKey]: 'color::v2'
    }
  | {
      type: 'inline'
      hue: number
      saturation: number
      lightness: number
      alpha: number
      [ControlDataTypeKey]: 'color::v2'
    }
  | {
      swatchId: string
      alpha: number
      [ControlDataTypeKey]?: 'color::v1'
    }

type ExpectedColorValue =
  | { type: 'swatch'; swatchId: string; alpha: number }
  | {
      type: 'inline'
      hue: number
      saturation: number
      lightness: number
      alpha: number
    }

describe('List Types', () => {
  describe('infers types from control definitions', () => {
    test('List of Colors', () => {
      const def = List({
        type: Color({ label: 'Color' }),
      })

      const colorFn = () => Color({ label: 'Color' })
      type ExpectedConfigTypeType = ReturnType<typeof colorFn>

      type Config = typeof def.config

      expectTypeOf<Config>().toEqualTypeOf<{
        type: ExpectedConfigTypeType
        label?: string
        description?: string
        getItemLabel?: (
          item?: ExpectedColorValue | undefined,
        ) => string | Promise<string>
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<
        {
          id: string
          type?: string
          value?: ExpectedColorData
        }[]
      >()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<ExpectedColorValue[]>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<(string | undefined)[]>()
    })

    test('List of List of Colors', () => {
      const def = List({
        type: List({
          type: Color({ label: 'Color' }),
        }),
      })

      const colorListFn = () =>
        List({
          type: Color({ label: 'Color' }),
        })
      type ExpectedConfigTypeType = ReturnType<typeof colorListFn>

      type Config = typeof def.config

      expectTypeOf<Config>().toEqualTypeOf<{
        type: ExpectedConfigTypeType
        label?: string
        description?: string
        getItemLabel?: (
          item?: ExpectedColorValue[] | undefined,
        ) => string | Promise<string>
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<
        {
          id: string
          type?: string
          value?: {
            id: string
            type?: string
            value?: ExpectedColorData
          }[]
        }[]
      >()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<ExpectedColorValue[][]>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<(string | undefined)[][]>()
    })
  })
})
