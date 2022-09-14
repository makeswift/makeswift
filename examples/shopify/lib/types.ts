import { ProductFragment } from './shopify'

export type PageProps = {
  products: ProductFragment[]
}

export type ProductPageProps = {
  products: ProductFragment[]
  product: ProductFragment
}
