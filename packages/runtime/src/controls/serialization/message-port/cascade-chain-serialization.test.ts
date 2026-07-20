import { unstable_Cascade, Checkbox, Combobox } from '@makeswift/controls'

import { deserializeFunction } from './function-serialization'
import { serializeCascadeChain } from './cascade-chain-serialization'

describe('serializeCascadeChain', () => {
  test('returns serialized records for the reachable chain', async () => {
    const cascade = unstable_Cascade({
      steps: [
        () => Checkbox({ defaultValue: true }),
        (_showDiscounts: boolean) => Combobox({ getOptions: async () => [] }),
      ],
    })

    const port = serializeCascadeChain(cascade)
    const materialize = deserializeFunction(port)
    const records = await materialize([])

    expect(records).toEqual([
      expect.objectContaining({ type: 'makeswift::controls::checkbox' }),
      expect.objectContaining({ type: 'makeswift::controls::combobox' }),
    ])
    port.close()
  })

  test('an unselected step yields only the reachable prefix', async () => {
    const cascade = unstable_Cascade({
      steps: [
        () => Combobox({ getOptions: async () => [] }),
        (_p: { id: string }) => Combobox({ getOptions: async () => [] }),
      ],
    })

    const port = serializeCascadeChain(cascade)
    const materialize = deserializeFunction(port)
    const records = await materialize([])

    expect(records).toHaveLength(1)
    port.close()
  })

  test('a step control with a nested function config (getOptions) round-trips without a DataCloneError', async () => {
    const cascade = unstable_Cascade({
      steps: [() => Combobox({ getOptions: async (query: string) => [{ id: query, label: query, value: query }] })],
    })

    const port = serializeCascadeChain(cascade)
    const materialize = deserializeFunction(port)
    const records = (await materialize([])) as unknown as [{ config: { getOptions: unknown } }]

    expect(records[0].config.getOptions).toBeInstanceOf(MessagePort)
    port.close()
  })
})
