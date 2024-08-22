import { expectTypeOf } from 'expect-type'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../associated-types'

import { Style } from './style'

describe('Style Types', () => {
  test('infers types from control definition', () => {
    const def = Style({
      properties: [Style.Border, Style.Margin],
    })

    type Config = typeof def.config
    expectTypeOf<Config>().toEqualTypeOf<{
      properties: (
        | 'makeswift::controls::style::property::width'
        | 'makeswift::controls::style::property::margin'
        | 'makeswift::controls::style::property::padding'
        | 'makeswift::controls::style::property::border'
        | 'makeswift::controls::style::property::border-radius'
        | 'makeswift::controls::style::property::text-style'
      )[]
    }>()

    type Data = DataType<typeof def>

    expectTypeOf<Data['width']>().toEqualTypeOf<
      | {
          value:
            | {
                value: number
                unit: 'px'
              }
            | {
                value: number
                unit: '%'
              }
          deviceId: string
        }[]
      | undefined
    >()

    type Margin =
      | {
          value: number
          unit: 'px'
        }
      | 'auto'
      | null
      | undefined

    expectTypeOf<Data['margin']>().toEqualTypeOf<
      | {
          value: {
            marginTop: Margin
            marginRight: Margin
            marginBottom: Margin
            marginLeft: Margin
          }

          deviceId: string
        }[]
      | undefined
    >()

    type Padding =
      | {
          value: number
          unit: 'px'
        }
      | null
      | undefined

    expectTypeOf<Data['padding']>().toEqualTypeOf<
      | {
          value: {
            paddingTop: Padding
            paddingRight: Padding
            paddingBottom: Padding
            paddingLeft: Padding
          }

          deviceId: string
        }[]
      | undefined
    >()

    type Border =
      | {
          width: number | null | undefined
          style: 'dotted' | 'dashed' | 'solid'
          color?:
            | {
                swatchId: string
                alpha: number
              }
            | null
            | undefined
        }
      | null
      | undefined

    expectTypeOf<Data['border']>().branded.toEqualTypeOf<
      | {
          value: {
            borderTop: Border
            borderRight: Border
            borderBottom: Border
            borderLeft: Border
          }
          deviceId: string
        }[]
      | undefined
    >()

    type BorderRadius =
      | {
          value: number
          unit: 'px'
        }
      | {
          value: number
          unit: '%'
        }
      | null
      | undefined

    expectTypeOf<Data['borderRadius']>().toEqualTypeOf<
      | {
          value: {
            borderTopLeftRadius?: BorderRadius
            borderTopRightRadius?: BorderRadius
            borderBottomRightRadius?: BorderRadius
            borderBottomLeftRadius?: BorderRadius
          }
          deviceId: string
        }[]
      | undefined
    >()

    type TextStyle = {
      fontFamily?: string | null | undefined
      letterSpacing: number | null | undefined
      fontSize:
        | {
            value: number
            unit: 'px'
          }
        | null
        | undefined
      fontWeight: number | null | undefined
      textTransform: 'uppercase'[]
      fontStyle: 'italic'[]
    }

    expectTypeOf<Data['textStyle']>().toEqualTypeOf<
      | {
          value: TextStyle
          deviceId: string
        }[]
      | undefined
    >()

    type Value = ValueType<typeof def>
    expectTypeOf<Value>().toEqualTypeOf<Data>()

    type Resolved = ResolvedValueType<typeof def>
    expectTypeOf<Resolved>().toEqualTypeOf<string>()
  })
})
