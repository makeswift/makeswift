export type NumberControlData = number

export const NumberControlType = 'makeswift::controls::number'

type NumberControlConfig = {
  label?: string
  labelOrientation?: 'vertical' | 'horizontal'
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  suffix?: string
}

export type NumberControlDefinition<C extends NumberControlConfig = NumberControlConfig> = {
  type: typeof NumberControlType
  config: C
}

export function Number<C extends NumberControlConfig>(
  config: C = {} as C,
): NumberControlDefinition<C> {
  return { type: NumberControlType, config }
}
