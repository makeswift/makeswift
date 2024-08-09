import { ReactNode } from 'react'
import {
  SlotDefinition,
  SlotControl,
  type SerializedRecord,
  type ResourceResolver,
  type Effector,
  type Resolvable,
  type DataType,
} from '@makeswift/controls'

import { renderStable } from '../runtimes/react/controls/render-stable'
import { renderSlot } from '../runtimes/react/controls/slot'

abstract class BaseDefinition extends SlotDefinition<ReactNode> {}

class Definition extends BaseDefinition {
  static deserialize(data: SerializedRecord): Definition {
    if (data.type !== Definition.type) {
      throw new Error(`Slot: expected type ${Definition.type}, got ${data.type}`)
    }

    return new Definition()
  }

  resolveValue(
    data: DataType<BaseDefinition> | undefined,
    _resolver: ResourceResolver,
    _effector: Effector,
    control?: SlotControl,
  ): Resolvable<ReactNode | undefined> {
    return {
      readStableValue: (previous?: ReactNode) =>
        renderStable(renderSlot, previous)({ data, control: control ?? null }),
      subscribe: () => () => {},
      triggerResolve: async () => {},
    }
  }
}

export const Slot = () => new (class Slot extends Definition {})()
export { Definition as SlotDefinition, SlotControl }
