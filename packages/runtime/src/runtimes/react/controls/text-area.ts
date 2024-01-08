import { match } from 'ts-pattern'
import { TextAreaControlData, TextAreaControlDataTypeKey, TextAreaControlDataTypeValueV1, TextAreaControlDefinition } from '../../../controls'

export type TextAreaControlValue<T extends TextAreaControlDefinition> =
  undefined extends T['config']['defaultValue'] ? string | undefined : string

export function useTextAreaValue<T extends TextAreaControlDefinition>(
  data: TextAreaControlData | undefined,
  definition: T,
): TextAreaControlValue<T> {
  const value: string | undefined = match(data)
  .with({ [TextAreaControlDataTypeKey]: TextAreaControlDataTypeValueV1 }, (val) => val.value)
  .otherwise(val => val) ?? definition.config.defaultValue

return value as TextAreaControlValue<T>
}
