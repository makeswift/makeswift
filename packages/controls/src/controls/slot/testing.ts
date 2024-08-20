import { SlotDefinition } from './slot'

export const renderedNode = Symbol('rendered node')

export type RenderedNode = typeof renderedNode

class Definition extends SlotDefinition<RenderedNode> {}

export function Slot(): Definition {
  return new Definition()
}

export { Definition as SlotDefinition }
