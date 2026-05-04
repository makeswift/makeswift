import {
  type SerializedRecord,
  type DeserializeControlOptions,
  ControlDefinition,
  serializeControls,
  deserializeControl,
} from '../base'
import { RSCSerializationVisitor } from './visitor'

export { type SerializedRecord, type DeserializedRecord } from '../base'

export function serializeRSCControls(
  controls: Record<string, ControlDefinition>,
): Record<string, SerializedRecord> {
  return serializeControls(controls, new RSCSerializationVisitor())
}

export function deserializeRSCControl(
  serializedControl: SerializedRecord,
  options?: Partial<DeserializeControlOptions>,
): ControlDefinition {
  const plugins = options?.plugins ?? []
  return deserializeControl(serializedControl, { plugins })
}
