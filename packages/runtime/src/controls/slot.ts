import { ReactNode } from 'react'
import {
  SlotDefinition as BaseSlotDefinition,
  SlotControl,
  StableValue,
  type SlotConfig,
  type DeserializedRecord,
  type ResourceResolver,
  type Stylesheet,
  type Resolvable,
  type DataType,
} from '@makeswift/controls'

import { renderSlot } from '../runtimes/react/controls/slot'

abstract class BaseDefinition extends BaseSlotDefinition<ReactNode> {}

export class SlotDefinition extends BaseDefinition {
  static deserialize(data: DeserializedRecord): SlotDefinition {
    if (data.type !== SlotDefinition.type) {
      throw new Error(`Slot: expected type ${SlotDefinition.type}, got ${data.type}`)
    }

    return Slot(data.config ?? {})
  }

  resolveValue(
    data: DataType<BaseDefinition> | undefined,
    _resolver: ResourceResolver,
    _stylesheet: Stylesheet,
    control?: SlotControl,
  ): Resolvable<ReactNode | undefined> {
    const stableValue = StableValue({
      name: SlotDefinition.type,
      read: () => renderSlot({ data, control: control ?? null, config: this.config }),
    })

    return {
      ...stableValue,
      triggerResolve: async () => {},
    }
  }
}

export function Slot(config: SlotConfig = {}): SlotDefinition {
  return new SlotDefinition(config)
}

export { SlotControl }
