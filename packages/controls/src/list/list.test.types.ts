import { List } from './list'
import {
  type DataType,
  type ValueType,
  type ResolvedValueType,
} from '../control-definition'
import { expectTypeOf } from 'expect-type'
import { ControlDataTypeKey } from '../common'
import { Color } from '../color'

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
        getItemLabel?: (item: string | undefined) => string | Promise<string>
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<
        {
          id: string
          type?: string
          value: {
            swatchId: string
            alpha: number
            [ControlDataTypeKey]?: 'color::v1'
          }
        }[]
      >()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<
        { swatchId: string; alpha: number }[]
      >()

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
        getItemLabel?: (
          item: (string | undefined)[],
        ) => string | Promise<string>
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<
        {
          id: string
          type?: string
          value: {
            id: string
            type?: string
            value: {
              swatchId: string
              alpha: number
              [ControlDataTypeKey]?: 'color::v1'
            }
          }[]
        }[]
      >()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<
        { swatchId: string; alpha: number }[][]
      >()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<(string | undefined)[][]>()
    })
  })
})
