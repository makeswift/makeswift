import { z } from 'zod'

export const serialized = z
  .object({
    type: z.string(),
  })
  .and(z.record(z.string(), z.unknown()))

export const serializedRecord = serialized.brand<'SerializedRecord'>()
export const deserializedRecord = serialized.brand<'DeserializedRecord'>()
