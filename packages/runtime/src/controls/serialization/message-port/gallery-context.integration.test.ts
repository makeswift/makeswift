import { unstable_Gallery } from '@makeswift/controls'

import { deserializeControl } from '../base'
import { ClientMessagePortSerializationVisitor } from './visitor'
import { functionDeserializationPlugin } from './function-serialization'
import { unstable_runWithControlContext, unstable_getControlContext } from './control-context'

describe('Gallery getOptions context seam (through control serialization)', () => {
  test('getOptions receives sibling context sent with the call', async () => {
    const gallery = unstable_Gallery({
      getOptions: async () => {
        const ctx = unstable_getControlContext()
        const productId = (ctx.productId as { value?: { id: string } } | undefined)?.value?.id
        if (productId == null) return { options: [] }
        return { options: [{ id: `${productId}-1`, src: `/${productId}/1.jpg` }] }
      },
    })

    const visitor = new ClientMessagePortSerializationVisitor()
    const serialized = gallery.accept(visitor)
    const transferables = visitor.getTransferables()

    const deserialized = deserializeControl(serialized, {
      plugins: [functionDeserializationPlugin],
    })

    const getOptions = (deserialized.config as { getOptions: () => Promise<unknown> }).getOptions

    const withContext = await unstable_runWithControlContext(
      { productId: { value: { id: 'p1' } } },
      () => getOptions() as Promise<{ options: { id: string; src: string }[] }>,
    )
    expect(withContext).toEqual({
      options: [{ id: 'p1-1', src: '/p1/1.jpg' }],
    })

    const withoutContext = (await getOptions()) as {
      options: { id: string; src: string }[]
    }
    expect(withoutContext).toEqual({ options: [] })

    transferables.forEach((port: any) => port.close())
  })
})
