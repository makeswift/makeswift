import { z } from 'zod'

import * as Schema from './schema'

export type SerializedRecord = z.infer<typeof Schema.serializedRecord>
export type DeserializedRecord = z.infer<typeof Schema.deserializedRecord>
