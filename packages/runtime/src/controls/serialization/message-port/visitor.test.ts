import { unstable_Cascade, Checkbox } from '@makeswift/controls'

import { ClientMessagePortSerializationVisitor } from './visitor'

describe('ClientMessagePortSerializationVisitor.visitCascade', () => {
  test('no longer throws, and returns a transferable port for steps', () => {
    const cascade = unstable_Cascade({ steps: [() => Checkbox()] })
    const visitor = new ClientMessagePortSerializationVisitor()

    const record = cascade.accept(visitor)
    const config = record.config as { steps: unknown }

    expect(record.type).toBe('makeswift::controls::cascade')
    expect(config.steps).toBeInstanceOf(MessagePort)
    expect(visitor.getTransferables()).toContain(config.steps)
  })
})
