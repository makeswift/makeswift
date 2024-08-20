import { type DataType, type ResolvedValueType } from '@makeswift/controls'

import { SelectDefinition } from '../../../controls'

export function useSelectControlValue(
  data: DataType<SelectDefinition> | undefined,
  definition: SelectDefinition,
): ResolvedValueType<SelectDefinition> {
  return definition.fromData(data) ?? definition.config.defaultValue
}
