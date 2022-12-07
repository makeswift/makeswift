import { CopyContext } from '../state/react-page'
import { ColorData } from './types'

export type ColorControlData = ColorData

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
}

export function Color<C extends ColorControlConfig>(config = {} as C): ColorControlDefinition<C> {
  return { type: ColorControlType, config }
}

export function copyColorData(
  value: ColorData | undefined,
  context: CopyContext,
): ColorData | undefined {
  if (value == null) return value

  return {
    ...value,
    swatchId: context.replacementContext.swatchIds.get(value.swatchId) ?? value.swatchId,
  }
}
