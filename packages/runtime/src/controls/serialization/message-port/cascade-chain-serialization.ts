import { type CascadeDefinition, type DataType, type SerializedRecord } from '@makeswift/controls'

import { ClientMessagePortSerializationVisitor } from './visitor'
import { serializeFunction, type SerializedFunction } from './function-serialization'

type CascadeData = DataType<CascadeDefinition>

export function serializeCascadeChain(
  definition: CascadeDefinition,
): SerializedFunction<(data: CascadeData) => Promise<SerializedRecord[]>> {
  return serializeFunction(async (data: CascadeData) => {
    const controls = definition.materializeForSerialization(data)
    const visitor = new ClientMessagePortSerializationVisitor()
    return controls.map(control => control.accept(visitor))
  })
}
