import { createContext, useContext } from 'react'
import { ProductFragment } from './bigcommerce/types'

export const ProductContext = createContext<ProductFragment | null>(null)

export function useProduct(): ProductFragment {
  const product = useContext(ProductContext)

  if (product != null) {
    return product
  }

  throw new Error('useProduct should only be used inside a ProductProvider')
}
