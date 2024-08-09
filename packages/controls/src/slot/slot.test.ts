import { type ResourceResolver } from '../resource-resolver'
import { type Effector } from '../effector'
import {
  type DataType,
  type ResolvedValueType,
  type Resolvable,
} from '../control-definition'

import { SlotDefinition } from './slot'

class Definition extends SlotDefinition<string> {
  resolveValue(
    data: DataType<SlotDefinition<string>> | undefined,
    _resolver: ResourceResolver,
    _effector: Effector,
  ): Resolvable<string | undefined> {
    return {
      readStableValue: () => JSON.stringify(data),
      subscribe: () => () => {},
      triggerResolve: async () => {},
    }
  }
}

describe('Slot', () => {
  describe('constructor', () => {
    test('resolved value type', () => {
      const slot = new Definition()
      const node: ResolvedValueType<typeof slot> = 'rendered node'

      expect(slot).toMatchSnapshot()
      expect(node).toBe('rendered node')
    })
  })
})
