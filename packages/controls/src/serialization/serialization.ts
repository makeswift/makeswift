import { deserializeObject, serializeObject } from './object-serialization'
import { type DeserializedRecord, type SerializedRecord } from './types'

export function serializeRecord(record: {
  type: string
}): [SerializedRecord, Transferable[]] {
  return serializeObject(record) as [SerializedRecord, Transferable[]]
}

export function deserializeRecord(
  record: SerializedRecord,
): DeserializedRecord {
  return deserializeObject(record) as DeserializedRecord
}
