import { runtime } from '@/makeswift/runtime'
import { lazy } from 'react'

import {
  Combobox,
  Style,
  unstable_Gallery,
  unstable_getControlContext,
} from '@makeswift/runtime/controls'

// Combobox resolves to the selected option's `value`, so the component sees
// this shape directly (not the whole `{ id, value, label }` option).
type Product = { id: string; label: string }

const PRODUCTS: { id: string; value: Product; label: string }[] = [
  { id: 'p1', value: { id: 'p1', label: 'Blue Sneakers' }, label: 'Blue Sneakers' },
  { id: 'p2', value: { id: 'p2', label: 'Red Hat' }, label: 'Red Hat' },
]

// Runtime-side stub standing in for a real image service, keyed by product id.
const IMAGES: Record<string, { id: string; src: string; label: string }[]> = {
  p1: [
    { id: 'p1-a', src: 'https://picsum.photos/seed/p1a/200', label: 'Front' },
    { id: 'p1-b', src: 'https://picsum.photos/seed/p1b/200', label: 'Side' },
  ],
  p2: [{ id: 'p2-a', src: 'https://picsum.photos/seed/p2a/200', label: 'Front' }],
}

runtime.registerComponent(lazy(() => import('./product-image-demo')), {
  type: 'Product Image Demo',
  label: 'Custom / Product Image Demo',
  props: {
    className: Style(),
    productId: Combobox({
      label: 'Product',
      getOptions: async query =>
        PRODUCTS.filter(p => p.label.toLowerCase().includes(query.toLowerCase())),
    }),
    productImage: unstable_Gallery({
      label: 'Product image',
      getOptions: async () => {
        const ctx = unstable_getControlContext()
        const productId = (ctx.productId as { value?: { id: string } } | undefined)?.value
          ?.id
        // Spike fallback: cosmos does not send context yet, so default to the
        // first product so the grid still renders in the builder.
        const key = productId ?? 'p1'
        return { options: IMAGES[key] ?? [] }
      },
    }),
  },
})
