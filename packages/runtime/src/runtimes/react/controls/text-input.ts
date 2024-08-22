import { type DataType, type ResolvedValueType } from '@makeswift/controls'

import { TextInputDefinition } from '../../../controls'

export function useTextInputValue(
  data: DataType<TextInputDefinition> | undefined,
  definition: TextInputDefinition,
): ResolvedValueType<TextInputDefinition> {
  return definition.fromData(data) ?? definition.config.defaultValue
}
