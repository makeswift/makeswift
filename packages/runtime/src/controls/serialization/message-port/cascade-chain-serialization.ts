import { type CascadeDefinition, type DataType, type SerializedRecord } from '@makeswift/controls'

import { ClientMessagePortSerializationVisitor } from './visitor'
import { serializeFunction, type SerializedFunction } from './function-serialization'

type CascadeData = DataType<CascadeDefinition>

export function serializeCascadeChain(
  definition: CascadeDefinition,
): SerializedFunction<(data: CascadeData) => Promise<SerializedRecord[]>> {
  let previousCallPorts: MessagePort[] = []

  return serializeFunction(async (data: CascadeData) => {
    const currentCallPorts: MessagePort[] = []
    try {
      const controls = definition.materializeForSerialization(data)
      const visitor = new ClientMessagePortSerializationVisitor(currentCallPorts)
      const records = controls.map(control => control.accept(visitor))
      previousCallPorts.forEach(port => port.close())
      previousCallPorts = currentCallPorts
      return records
    } catch (error) {
      currentCallPorts.forEach(port => port.close())
      throw error
    }
  })
}
