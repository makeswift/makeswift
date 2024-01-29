import { match } from 'ts-pattern'
import {
  TextInputControlData,
  TextInputControlDataTypeKey,
  TextInputControlDataTypeValueV1,
  TextInputControlDefinition,
} from '../../../controls'

export type TextInputControlValue<T extends TextInputControlDefinition> =
  undefined extends T['config']['defaultValue'] ? string | undefined : string

export function useTextInputValue<T extends TextInputControlDefinition>(
  data: TextInputControlData | undefined,
  definition: T,
): TextInputControlValue<T> {
  const value: string | undefined =
    match(data)
      .with({ [TextInputControlDataTypeKey]: TextInputControlDataTypeValueV1 }, val => val.value)
      .otherwise(val => val) ?? definition.config.defaultValue

  return value as TextInputControlValue<T>
}
