import { createContext, useContext } from 'react'

import { usePreviewableLocale } from 'components'

import { ProductFragment, DEFAULT_PRODUCT } from './bigcommerce'
import { translateProduct } from './products-context'

export const ProductContext = createContext<ProductFragment>(DEFAULT_PRODUCT)

export function useProductFromPath() {
  const product = useContext(ProductContext)
  const locale = usePreviewableLocale()

  return translateProduct(product, locale)
}
