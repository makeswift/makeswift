import {
  ComboboxControlData,
  ComboboxControlDefinition,
  ComboboxControlDefinitionOption,
} from '../../../controls'

export type ComboboxControlValue<T extends ComboboxControlDefinition> =
  | ComboboxControlDefinitionOption<T>
  | undefined

export function useComboboxControlValue<T extends ComboboxControlDefinition>(
  data: ComboboxControlData<T> | undefined,
): ComboboxControlValue<T> {
  return data?.value
}
