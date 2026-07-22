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

  test('a newer materialization closes the previous call’s host-side ports', async () => {
    const cascade = unstable_Cascade({
      steps: [
        () =>
          Combobox({
            getOptions: async (query: string) => [{ id: query, label: query, value: query }],
          }),
      ],
    })

    const port = serializeCascadeChain(cascade)
    const materializeChain = deserializeFunction(port)
    const allPorts: MessagePort[] = []

    try {
      const [first] = (await materializeChain([])) as unknown as [{ config: { getOptions: unknown } }]
      const firstGetOptionsPort = first.config.getOptions as MessagePort
      allPorts.push(firstGetOptionsPort)
      const firstGetOptions = deserializeFunction(
        firstGetOptionsPort as Parameters<typeof deserializeFunction>[0],
      )

      // the first reply's channel is alive before supersession
      await expect(firstGetOptions('a')).resolves.toEqual([{ id: 'a', label: 'a', value: 'a' }])

      const [second] = (await materializeChain([])) as unknown as [{ config: { getOptions: unknown } }] // supersede: a newer call arrives
      const secondGetOptionsPort = second.config.getOptions as MessagePort
      allPorts.push(secondGetOptionsPort)
      const secondGetOptions = deserializeFunction(
        secondGetOptionsPort as Parameters<typeof deserializeFunction>[0],
      )

      // the current call's channel still works after supersession
      await expect(secondGetOptions('b')).resolves.toEqual([{ id: 'b', label: 'b', value: 'b' }])

      const closed = new Promise(resolve => {
        firstGetOptionsPort.addEventListener('close', () => resolve('closed'))
      })
      const timeout = new Promise(resolve => setTimeout(() => resolve('timeout'), 500))

      await expect(Promise.race([closed, timeout])).resolves.toBe('closed')
    } finally {
      allPorts.forEach(p => p.close())
      port.close()
    }
  })
})
