import { type DataType, type ResolvedValueType } from '@makeswift/controls'

import { NumberDefinition } from '../../../controls'

export function useNumber(
  data: DataType<NumberDefinition> | undefined,
  definition: NumberDefinition,
): ResolvedValueType<NumberDefinition> {
  return definition.fromData(data) ?? definition.config.defaultValue
}
