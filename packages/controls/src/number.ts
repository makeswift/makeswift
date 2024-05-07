import { ControlDataTypeKey } from "./common/data-type-key"

export const NumberControlDataTypeKey = ControlDataTypeKey

export const NumberControlDataTypeValueV1 = 'number::v1'

export type NumberControlDataV0 = number

export type NumberControlDataV1 = {
  [NumberControlDataTypeKey]: typeof NumberControlDataTypeValueV1
  value: number,
}

export type NumberControlData = NumberControlDataV0 | NumberControlDataV1

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
  version?: 1
}

export function Number<C extends NumberControlConfig>(
  config: C = {} as C,
): NumberControlDefinition<C> {
  return { type: NumberControlType, config, version: 1 }
}
