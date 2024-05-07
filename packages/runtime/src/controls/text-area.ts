import { ControlDataTypeKey } from "@makeswift/controls"

export const TextAreaControlDataTypeKey = ControlDataTypeKey

export const TextAreaControlDataTypeValueV1 = 'text-area::v1'

export type TextAreaControlDataV0 = string

export type TextAreaControlDataV1 = {
  [TextAreaControlDataTypeKey]: typeof TextAreaControlDataTypeValueV1
  value: string,
}

export type TextAreaControlData = TextAreaControlDataV0 | TextAreaControlDataV1

export const TextAreaControlType = 'makeswift::controls::text-area'

type TextAreaControlConfig = {
  label?: string
  defaultValue?: string
  rows?: number
}

export type TextAreaControlDefinition<C extends TextAreaControlConfig = TextAreaControlConfig> = {
  type: typeof TextAreaControlType
  config: C
  version?: 1
}

export function TextArea<C extends TextAreaControlConfig>(
  config: C = {} as C,
): TextAreaControlDefinition<C> {
  return { type: TextAreaControlType, config, version: 1 }
}
