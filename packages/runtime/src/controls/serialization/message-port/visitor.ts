import { AnyFunction, SerializationPlugin, isFunction, type CascadeDefinition, type SerializedRecord } from '@makeswift/controls'

import { BaseControlSerializationVisitor } from '../base/visitor'
import { serializeFunction } from './function-serialization'
import { serializeCascadeChain } from './cascade-chain-serialization'

export class ClientMessagePortSerializationVisitor extends BaseControlSerializationVisitor {
  private transferables: Transferable[] = []

  constructor(hostPortRegistry?: MessagePort[]) {
    const serializeFunctionPlugin: SerializationPlugin<AnyFunction> = {
      match: isFunction,
      serialize: (val: AnyFunction) => {
        const r = serializeFunction(val, hostPortRegistry)
        this.transferables.push(r)
        return r
      },
    }

    super([serializeFunctionPlugin])
  }

  visitCascade(def: CascadeDefinition): SerializedRecord {
    const stepsPort = serializeCascadeChain(def)
    this.transferables.push(stepsPort)

    return {
      type: def.controlType,
      config: {
        label: def.config.label,
        description: def.config.description,
        steps: stepsPort,
      },
    } as unknown as SerializedRecord
  }

  getTransferables(): Transferable[] {
    return [...this.transferables]
  }
}
