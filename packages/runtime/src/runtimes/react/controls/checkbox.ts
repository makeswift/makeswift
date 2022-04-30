import { CheckboxControlData, CheckboxControlDefinition } from '../../../controls'

export type CheckboxControlValue<T extends CheckboxControlDefinition> =
  undefined extends T['config']['defaultValue'] ? boolean | undefined : boolean

export function useCheckboxControlValue<T extends CheckboxControlDefinition>(
  data: CheckboxControlData | undefined,
  definition: T,
): CheckboxControlValue<T> {
  return (data ?? definition.config.defaultValue) as CheckboxControlValue<T>
}
