import { AnyFunction, SerializationPlugin, isFunction } from '@makeswift/controls'

import { BaseControlSerializationVisitor } from '../base/visitor'
import { serializeFunction } from './function-serialization'

export class ClientMessagePortSerializationVisitor extends BaseControlSerializationVisitor {
  private transferables: Transferable[] = []

  constructor() {
    const serializeFunctionPlugin: SerializationPlugin<AnyFunction> = {
      match: isFunction,
      serialize: (val: AnyFunction) => {
        const r = serializeFunction(val)
        this.transferables.push(r)
        return r
      },
    }

    super([serializeFunctionPlugin])
  }

  getTransferables(): Transferable[] {
    return [...this.transferables]
  }
}
