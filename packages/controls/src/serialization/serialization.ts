import { deserializeObject } from './object-serialization'
import { type DeserializedRecord, type SerializedRecord } from './types'

export function deserializeRecord(
  record: SerializedRecord,
): DeserializedRecord {
  return deserializeObject(record) as DeserializedRecord
}
