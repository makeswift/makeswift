import { createContext, useContext } from 'react'

import { ProductFragment, DEFAULT_PRODUCT } from './bigcommerce'

export const ProductContext = createContext<ProductFragment>(DEFAULT_PRODUCT)

export function useProductFromPath() {
  return useContext(ProductContext)
}
