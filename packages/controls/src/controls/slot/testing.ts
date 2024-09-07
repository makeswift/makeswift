import { type ResourceResolver } from '../../resources/resolver'

import { type DataType } from '../associated-types'
import { type Resolvable } from '../definition'

import { SlotDefinition } from './slot'

export const renderedNode = Symbol('rendered node')

export type RenderedNode = typeof renderedNode

class Definition extends SlotDefinition<RenderedNode> {
  resolveValue(
    _data: DataType<SlotDefinition<RenderedNode>> | undefined,
    _resolver: ResourceResolver,
  ): Resolvable<RenderedNode | undefined> {
    return {
      name: Definition.type,
      readStable: () => renderedNode,
      subscribe: () => () => {},
      triggerResolve: async () => {},
    }
  }
}

export function Slot(): Definition {
  return new Definition()
}

export { Definition as SlotDefinition }
