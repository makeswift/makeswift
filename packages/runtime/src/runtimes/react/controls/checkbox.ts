import { match } from 'ts-pattern'
import {
  CheckboxControlData,
  CheckboxControlDataTypeKey,
  CheckboxControlDataTypeValueV1,
  CheckboxControlDefinition,
} from '../../../controls'

export type CheckboxControlValue<T extends CheckboxControlDefinition> =
  undefined extends T['config']['defaultValue'] ? boolean | undefined : boolean

export function useCheckboxControlValue<T extends CheckboxControlDefinition>(
  data: CheckboxControlData | undefined,
  definition: T,
): CheckboxControlValue<T> {
  const value: boolean | undefined =
    match(data)
      .with({ [CheckboxControlDataTypeKey]: CheckboxControlDataTypeValueV1 }, val => val.value)
      .otherwise(val => val) ?? definition.config.defaultValue

  return value as CheckboxControlValue<T>
}
