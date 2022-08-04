import { getProduct, getProducts } from './bigcommerce'

const DEFAULT_PRODUCT_ID = 77

const shopName = process.env.STORE_NAME
const bigcommerceAccessToken = process.env.ACCESS_TOKEN

export const getProductSlugPaths = async (): Promise<string[]> => {
  const products = await getProducts()

  // @ts-ignore
  return products.map(edge => edge.node.entityId).map(entityId => `/product/${entityId}`)
}

export const getProductBySlug = async (slug: string): Promise<number> => {
  return await getProduct(parseInt(slug.split('/').at(-1) ?? ''))
}
