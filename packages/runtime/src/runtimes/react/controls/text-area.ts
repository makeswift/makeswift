import { type DataType, type ResolvedValueType } from '@makeswift/controls'

import { TextAreaDefinition } from '../../../controls'

export function useTextAreaValue(
  data: DataType<TextAreaDefinition> | undefined,
  definition: TextAreaDefinition,
): ResolvedValueType<TextAreaDefinition> {
  return definition.fromData(data) ?? definition.config.defaultValue
}
