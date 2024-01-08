import { match } from 'ts-pattern'
import type { CopyContext } from '../state/react-page'
import type { ColorData } from './types'
import { ControlDataTypeKey } from './control-data-type-key'

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

export function copyColorData(
  value: ColorControlData | undefined,
  context: CopyContext,
): ColorControlData | undefined {
  if (value == null) return value

  return match(value)
    .with({ [ColorControlDataTypeKey]: ColorControlDataTypeValueV1 }, val => ({
      ...val,
      swatchId: context.replacementContext.swatchIds.get(val.swatchId) ?? val.swatchId,
    }))
    .otherwise(val => ({
      ...val,
      swatchId: context.replacementContext.swatchIds.get(val.swatchId) ?? val.swatchId,
    }))
}
