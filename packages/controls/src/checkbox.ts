import { ControlDataTypeKey } from "./common/data-type-key"

export const CheckboxControlDataTypeKey = ControlDataTypeKey

export const CheckboxControlDataTypeValueV1 = 'checkbox::v1'

export type CheckboxControlDataV0 = boolean

export type CheckboxControlDataV1 = {
  [CheckboxControlDataTypeKey]: typeof CheckboxControlDataTypeValueV1
  value: boolean,
}

export type CheckboxControlData = CheckboxControlDataV0 | CheckboxControlDataV1

export const CheckboxControlType = 'makeswift::controls::checkbox'

type CheckboxControlConfig = {
  label?: string
  defaultValue?: boolean
}

export type CheckboxControlDefinition<C extends CheckboxControlConfig = CheckboxControlConfig> = {
  type: typeof CheckboxControlType
  config: C
  version?: 1
}

export function Checkbox<C extends CheckboxControlConfig>(
  config: C = {} as C,
): CheckboxControlDefinition<C> {
  return { type: CheckboxControlType, config, version: 1 }
}
