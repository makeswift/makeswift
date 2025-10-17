import {
  DeserializationPlugin,
  deserializeObject,
} from './object-serialization'
import { type DeserializedRecord, type SerializedRecord } from './types'

export function deserializeRecord(
  record: SerializedRecord,
  plugins: DeserializationPlugin<any>[] = [],
): DeserializedRecord {
  return deserializeObject(record, plugins) as DeserializedRecord
}
