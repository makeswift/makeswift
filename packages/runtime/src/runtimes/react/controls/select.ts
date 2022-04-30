import {
  SelectControlData,
  SelectControlDefinition,
  SelectControlDefinitionOption,
} from '../../../controls'

export type SelectControlValue<T extends SelectControlDefinition> =
  undefined extends T['config']['defaultValue']
    ? SelectControlDefinitionOption<T> | undefined
    : SelectControlDefinitionOption<T>

export function useSelectControlValue<T extends SelectControlDefinition>(
  data: SelectControlData<T> | undefined,
  definition: T,
): SelectControlValue<T> {
  return (data ?? definition?.config.defaultValue) as SelectControlValue<T>
}
