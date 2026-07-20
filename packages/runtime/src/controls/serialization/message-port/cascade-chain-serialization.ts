import { type CascadeDefinition, type Data, type SerializedRecord } from '@makeswift/controls'

import { ClientMessagePortSerializationVisitor } from './visitor'
import { serializeFunction, type SerializedFunction } from './function-serialization'

export function serializeCascadeChain(
  definition: CascadeDefinition,
): SerializedFunction<(data: Data[]) => Promise<SerializedRecord[]>> {
  return serializeFunction(async (data: Data[]) => {
    const controls = definition.materializeForSerialization(data)
    const visitor = new ClientMessagePortSerializationVisitor()
    return controls.map(control => control.accept(visitor))
  })
}
