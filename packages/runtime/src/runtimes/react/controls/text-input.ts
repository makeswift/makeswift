import { TextInputControlData, TextInputControlDefinition } from '../../../controls'

export type TextInputControlValue<T extends TextInputControlDefinition> =
  undefined extends T['config']['defaultValue'] ? string | undefined : string

export function useTextInputValue<T extends TextInputControlDefinition>(
  data: TextInputControlData | undefined,
  definition: T,
): TextInputControlValue<T> {
  return (data ?? definition.config.defaultValue) as TextInputControlValue<T>
}
