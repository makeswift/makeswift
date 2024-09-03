import { ControlDefinition, type DataType, type ResolvedValueType } from '@makeswift/controls'

export function useResolvedValue(
  data: DataType<ControlDefinition> | undefined,
  definition: ControlDefinition,
): ResolvedValueType<ControlDefinition> {
  return definition.resolveValue(data).readStableValue()
}
