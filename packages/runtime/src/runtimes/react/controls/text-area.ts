import { TextAreaControlData, TextAreaControlDefinition } from '../../../controls'

export type TextAreaControlValue<T extends TextAreaControlDefinition> =
  undefined extends T['config']['defaultValue'] ? string | undefined : string

export function useTextAreaValue<T extends TextAreaControlDefinition>(
  data: TextAreaControlData | undefined,
  definition: T,
): TextAreaControlValue<T> {
  return (data ?? definition.config.defaultValue) as TextAreaControlValue<T>
}
