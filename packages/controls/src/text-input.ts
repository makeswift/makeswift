import { ControlDataTypeKey } from './common'

export const TextInputControlDataTypeKey = ControlDataTypeKey

export const TextInputControlDataTypeValueV1 = 'text-input::v1'

export type TextInputControlDataV0 = string

export type TextInputControlDataV1 = {
  [ControlDataTypeKey]: typeof TextInputControlDataTypeValueV1
  value: string
}

export type TextInputControlData = TextInputControlDataV0 | TextInputControlDataV1

export const TextInputControlType = 'makeswift::controls::text-input'

type TextInputControlConfig = {
  label?: string
  defaultValue?: string
}

export type TextInputControlDefinition<C extends TextInputControlConfig = TextInputControlConfig> =
  {
    type: typeof TextInputControlType
    config: C
    version?: 1
  }

export function TextInput<C extends TextInputControlConfig>(
  config: C = {} as C,
): TextInputControlDefinition<C> {
  return { type: TextInputControlType, config, version: 1 }
}
