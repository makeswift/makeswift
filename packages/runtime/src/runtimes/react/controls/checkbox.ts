import { type DataType, type ResolvedValueType } from '@makeswift/controls'

import { CheckboxDefinition } from '../../../controls'

export function useCheckboxControlValue(
  data: DataType<CheckboxDefinition> | undefined,
  definition: CheckboxDefinition,
): ResolvedValueType<CheckboxDefinition> {
  return definition.fromData(data) ?? definition.config.defaultValue
}
