import { createContext, useContext } from 'react'

import { DEFAULT_PRODUCT, ProductFragment } from './shopify'

export const ProductContext = createContext<ProductFragment>(DEFAULT_PRODUCT)

export function useProduct() {
  return useContext(ProductContext)
}
