import { CascadeDefinition } from '@makeswift/controls'
import { deserializeUnifiedControlDef } from './index'

test('deserializeUnifiedControlDef routes a cascade record to CascadeDefinition', () => {
  const record = {
    type: CascadeDefinition.type,
    config: { label: 'x', stages: [] },
  }
  const def = deserializeUnifiedControlDef(record as any)
  expect(def).toBeInstanceOf(CascadeDefinition)
})
