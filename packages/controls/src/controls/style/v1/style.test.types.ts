import { expectTypeOf } from 'expect-type'

import { ControlDataTypeKey } from '../../../common'
import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../../associated-types'

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

    type Value = ValueType<typeof def>

    expectTypeOf<Value['width']>().toEqualTypeOf<
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

    expectTypeOf<Value['margin']>().toEqualTypeOf<
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

    expectTypeOf<Value['padding']>().toEqualTypeOf<
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
            | { type: 'swatch'; swatchId: string; alpha: number }
            | {
                type: 'inline'
                hue: number
                saturation: number
                lightness: number
                alpha: number
              }
            | null
            | undefined
        }
      | null
      | undefined

    expectTypeOf<Value['border']>().branded.toEqualTypeOf<
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

    expectTypeOf<Value['borderRadius']>().toEqualTypeOf<
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

    expectTypeOf<Value['textStyle']>().toEqualTypeOf<
      | {
          value: TextStyle
          deviceId: string
        }[]
      | undefined
    >()

    type Data = DataType<typeof def>
    type V1Data = Extract<Data, { [ControlDataTypeKey]: string }>
    type V0Data = Exclude<Data, V1Data>

    expectTypeOf<V1Data>().branded.toEqualTypeOf<
      Value & { [ControlDataTypeKey]: 'style::v1' }
    >()

    type V0Border =
      | {
          width: number | null | undefined
          style: 'dotted' | 'dashed' | 'solid'
          color?: { swatchId: string; alpha: number } | null | undefined
        }
      | null
      | undefined

    expectTypeOf<V0Data['border']>().branded.toEqualTypeOf<
      | {
          value: {
            borderTop: V0Border
            borderRight: V0Border
            borderBottom: V0Border
            borderLeft: V0Border
          }
          deviceId: string
        }[]
      | undefined
    >()

    type Resolved = ResolvedValueType<typeof def>
    expectTypeOf<Resolved>().toEqualTypeOf<string>()
  })
})
