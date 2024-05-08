import { ControlDataTypeKey, ColorData } from './common'

export const ColorControlDataTypeKey = ControlDataTypeKey

export const ColorControlDataTypeValueV1 = 'color::v1'

export type ColorControlDataV0 = ColorData

export type ColorControlDataV1 = ColorControlDataV0 & {
  [ColorControlDataTypeKey]: typeof ColorControlDataTypeValueV1
}

export type ColorControlData = ColorControlDataV0 | ColorControlDataV1

export const ColorControlType = 'makeswift::controls::color'

type ColorControlConfig = {
  label?: string
  labelOrientation?: 'horizontal' | 'vertical'
  defaultValue?: string
  hideAlpha?: boolean
}

export type ColorControlDefinition<C extends ColorControlConfig = ColorControlConfig> = {
  type: typeof ColorControlType
  config: C
  version?: 1
}

export function Color<C extends ColorControlConfig>(config = {} as C): ColorControlDefinition<C> {
  return { type: ColorControlType, config, version: 1 }
}