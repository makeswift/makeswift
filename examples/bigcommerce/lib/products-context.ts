import { createContext, useContext } from 'react'
import { ProductFragment } from './bigcommerce/types'

export const ProductsContext = createContext<ProductFragment[] | null>(null)

export function useProduct(id: number): ProductFragment | undefined {
  const products = useContext(ProductsContext)

  if (products != null) {
    return products.find(product => product.entityId === id)
  }

  throw new Error('useProducts should only be used inside a ProductsProvider')
}

export function useProducts({
  count = 4,
  categoryEntityId,
}: {
  count?: number
  categoryEntityId?: string
}): ProductFragment[] {
  const products = useContext(ProductsContext)

  if (products != null) {
    return products
      .filter((product: ProductFragment) =>
        categoryEntityId
          ? product.categories.edges.some(c => c.node.entityId.toString() === categoryEntityId)
          : true,
      )
      .slice(0, count)
  }

  throw new Error('useProducts should only be used inside a ProductsProvider')
}
