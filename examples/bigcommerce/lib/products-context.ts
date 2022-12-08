import { usePreviewableLocale } from 'components'
import { createContext, useContext } from 'react'
import { ProductFragment, TranslatedProductFragment } from './bigcommerce/types'
import { DEFAULT_LOCALE, Locale } from './locale'

export const ProductsContext = createContext<ProductFragment[] | null>(null)

export function translateProduct(
  product: ProductFragment,
  locale: Locale = DEFAULT_LOCALE,
): TranslatedProductFragment {
  switch (locale) {
    case 'es':
      const localeSpecificProductData =
        product.spanishTranslations?.edges.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.node.key]: curr.node.value,
          }),
          {},
        ) ?? {}

      return { ...product, ...localeSpecificProductData }
    default:
      return product
  }
}

export function useProduct(id: number): TranslatedProductFragment | undefined {
  const products = useContext(ProductsContext)
  const locale = usePreviewableLocale()

  if (products != null) {
    const product = products.find(product => product.entityId === id)

    return product ? translateProduct(product, locale) : undefined
  }

  throw new Error('useProducts should only be used inside a ProductsProvider')
}

export function useProducts({
  count = 4,
  categoryEntityId,
}: {
  count?: number
  categoryEntityId?: string
}): TranslatedProductFragment[] {
  const products = useContext(ProductsContext)
  const locale = usePreviewableLocale()

  if (products != null) {
    return products
      .filter((product: ProductFragment) =>
        categoryEntityId
          ? product.categories.edges.some(c => c.node.entityId.toString() === categoryEntityId)
          : true,
      )
      .slice(0, count)
      .map(product => translateProduct(product, locale))
  }

  throw new Error('useProducts should only be used inside a ProductsProvider')
}
