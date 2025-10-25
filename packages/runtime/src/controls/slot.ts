import { ReactNode } from 'react'
import {
  SlotDefinition as BaseSlotDefinition,
  SlotControl,
  StableValue,
  type DeserializedRecord,
  type ResourceResolver,
  type Stylesheet,
  type Resolvable,
  type DataType,
} from '@makeswift/controls'

import { renderSlot } from '../runtimes/react/controls/slot'

type Config = {
  columnCount?: number
}

abstract class BaseDefinition extends BaseSlotDefinition<ReactNode> {}

export class SlotDefinition extends BaseDefinition {
  static deserialize(data: DeserializedRecord): SlotDefinition {
    if (data.type !== SlotDefinition.type) {
      throw new Error(`Slot: expected type ${SlotDefinition.type}, got ${data.type}`)
    }

    const { config } = data
    return Slot(typeof config === 'object' && config != null ? (config as Config) : undefined)
  }

  resolveValue(
    data: DataType<BaseDefinition> | undefined,
    _resolver: ResourceResolver,
    _stylesheet: Stylesheet,
    control?: SlotControl,
  ): Resolvable<ReactNode | undefined> {
    const stableValue = StableValue({
      name: SlotDefinition.type,
      read: () => renderSlot({ data, control: control ?? null, config: this.config as Config }),
    })

    return {
      ...stableValue,
      triggerResolve: async () => {},
    }
  }
}

export function Slot(config?: Config): SlotDefinition {
  return new SlotDefinition(config as unknown as never)
}

export { SlotControl }
