import {
  type ResourceResolver,
  type ValueSubscription,
} from '../resource-resolver'
import { type Effector } from '../effector'
import { type DataType, type ResolvedValueType } from '../control-definition'

import { SlotDefinition } from './slot'

class Definition extends SlotDefinition<string> {
  resolveValue(
    data: DataType<SlotDefinition<string>> | undefined,
    _resolver: ResourceResolver,
    _effector: Effector,
  ): ValueSubscription<string | undefined> {
    return {
      readStableValue: () => JSON.stringify(data),
      subscribe: () => () => {},
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
