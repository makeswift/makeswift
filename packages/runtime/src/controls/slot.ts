import { ReactNode } from 'react'
import {
  SlotDefinition as BaseSlotDefinition,
  SlotControl,
  type DeserializedRecord,
} from '@makeswift/controls'

abstract class BaseDefinition extends BaseSlotDefinition<ReactNode> {}

export class SlotDefinition extends BaseDefinition {
  static deserialize(data: DeserializedRecord): SlotDefinition {
    if (data.type !== SlotDefinition.type) {
      throw new Error(`Slot: expected type ${SlotDefinition.type}, got ${data.type}`)
    }

    return Slot()
  }
}

export function Slot(): SlotDefinition {
  return new SlotDefinition()
}

export { SlotControl }
