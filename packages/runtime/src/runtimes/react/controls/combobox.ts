import { type DataType, type ResolvedValueType } from '@makeswift/controls'

import { ComboboxDefinition } from '../../../controls'

export function useComboboxControlValue(
  data: DataType<ComboboxDefinition> | undefined,
): ResolvedValueType<ComboboxDefinition> {
  return data?.value
}
