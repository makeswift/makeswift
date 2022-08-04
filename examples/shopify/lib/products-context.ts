import { createContext, useContext } from 'react'

import { ProductFragment } from './shopify/types'

export const ProductsContext = createContext<ProductFragment[] | null>(null)

export function useProducts({
  count = 4,
  collectionId,
}: {
  count?: number
  collectionId?: string
}): ProductFragment[] {
  const products = useContext(ProductsContext)

  if (products != null) {
    return products
      .filter((product: ProductFragment) =>
        collectionId ? product.collections.edges.some(c => c.node.id === collectionId) : true,
      )
      .slice(0, count)
  }

  throw new Error('useProducts should only be used inside a ProductsProvider')
}
