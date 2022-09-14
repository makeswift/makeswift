import { ProductFragment } from './bigcommerce'

export type PageProps = {
  products: ProductFragment[]
}

export type ProductPageProps = {
  products: ProductFragment[]
  product: ProductFragment
}
