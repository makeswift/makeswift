import { type SerializedRecord, type DeserializeControlOptions } from './base'

export { type SerializedRecord, serializeControls } from './base'

export function isSerializedRecord(r: unknown): r is SerializedRecord {
  return r != null && typeof r === 'object' && 'type' in r && typeof r.type === 'string'
}

export type DeserializeControlRecordsOptions = {
  onError?: (err: Error, context: { key: string; serializedControl: unknown }) => void
} & Partial<Pick<DeserializeControlOptions, 'plugins'>>

export function deserializeControlRecords<T>(
  serializedControls: Record<string, unknown>,
  deserialize: (
    serializedControl: SerializedRecord,
    options?: Partial<DeserializeControlOptions>,
  ) => T,
  { onError, plugins }: DeserializeControlRecordsOptions = {},
): Record<string, T> {
  return Object.entries(serializedControls).reduce<Record<string, T>>(
    (deserializedControls, [key, serializedControl]) => {
      try {
        if (!isSerializedRecord(serializedControl)) {
          throw new Error(
            `Expected serialized control data, got ${JSON.stringify(serializedControl)}`,
          )
        }
        const deserializedControl = deserialize(serializedControl, { plugins })
        return { ...deserializedControls, [key]: deserializedControl }
      } catch (err: unknown) {
        const error =
          err instanceof Error
            ? new Error(`Could not deserialize control for "${key}": ${err.message}`, {
                cause: err,
              })
            : new Error(`Could not deserialize control for "${key}", unknown error: ${err}`)

        onError?.(error, { key, serializedControl })

        return deserializedControls
      }
    },
    {},
  )
}
