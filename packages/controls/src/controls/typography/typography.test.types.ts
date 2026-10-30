import { expectTypeOf } from 'expect-type'

import { ControlDataTypeKey } from '../../common'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../associated-types'

import { unstable_Typography } from './typography'

type Typography<Color> = {
  id?: string
  style: {
    value: {
      fontFamily?: string | null
      lineHeight?: number | null
      letterSpacing?: number | null
      fontWeight?: number | null
      textAlign?: string | null
      uppercase?: boolean | null
      underline?: boolean | null
      strikethrough?: boolean | null
      italic?: boolean | null
      fontSize?: { value: number | null; unit: string | null } | null
      color?: Color | null
    }
    deviceId: string
  }[]
}

type ColorDataV1 = { swatchId: string | null; alpha: number | null }
type ColorDataV2 =
  | (ColorDataV1 & { type: 'swatch' })
  | {
      type: 'inline'
      hue: number
      saturation: number
      lightness: number
      alpha: number
    }

describe('Typography Types', () => {
  test('infers types from control definition', () => {
    const def = unstable_Typography()

    type Config = typeof def.config
    expectTypeOf<Config>().toEqualTypeOf<unknown>()

    type Value = Exclude<ValueType<typeof def>, undefined>
    expectTypeOf<Value>().branded.toEqualTypeOf<Typography<ColorDataV2>>()

    type Data = Exclude<DataType<typeof def>, undefined>
    type V1Data = Extract<Data, { [ControlDataTypeKey]: string }>
    type V0Data = Exclude<Data, V1Data>

    expectTypeOf<V1Data>().branded.toEqualTypeOf<
      Value & { [ControlDataTypeKey]: 'typography::v1' }
    >()
    expectTypeOf<V0Data>().toEqualTypeOf<Typography<ColorDataV1>>()

    type Resolved = ResolvedValueType<typeof def>
    expectTypeOf<Resolved>().toEqualTypeOf<string>()
  })
})
