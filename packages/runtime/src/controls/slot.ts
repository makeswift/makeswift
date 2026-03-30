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

export type SlotPlaceholderConfig = {
  builderOnly?: boolean
  height?: number
  text?: string
}

// TODO: We need to make a decision on how we want to allow users to configure
// the Slot placeholder. Some considerations (not exhaustive):
// - Inline vs block slot placeholders
// - Slots that shouldn't occupy space when they are empty
// - Slots that are only shown when you engage drop & drop in the builder
// - Which of these behaviors should be configurable vs. hardcoded
// - Addressing the builtin box
//
// For now, this initial config allows us to experiment with some initial
// customization. This is subject to change.
export type SlotConfig = {
  unstable_placeholder?: SlotPlaceholderConfig
}

abstract class BaseDefinition extends BaseSlotDefinition<ReactNode, SlotConfig> {}

export class SlotDefinition extends BaseDefinition {
  static deserialize(data: DeserializedRecord): SlotDefinition {
    if (data.type !== SlotDefinition.type) {
      throw new Error(`Slot: expected type ${SlotDefinition.type}, got ${data.type}`)
    }

    return Slot(data.config ?? {})
  }

  constructor(config: SlotConfig = {}) {
    super(config)
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
