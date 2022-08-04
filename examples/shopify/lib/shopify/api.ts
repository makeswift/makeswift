import { getConfig } from '../config'
import { DEFAULT_PRODUCT } from './default-values'
import { COLLECTIONS_QUERY, PRODUCTS_QUERY, PRODUCT_QUERY } from './graphql'
import {
  Collection,
  CollectionsQuery,
  GraphQLResponse,
  ProductFragment,
  ProductQuery,
  ProductsQuery,
} from './types'

export async function getProducts(): Promise<ProductFragment[]> {
  const config = getConfig()
  const response = await fetch(
    `https://${config.shopify.storeName}.myshopify.com/api/2022-07/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/graphql',
        'X-Shopify-Storefront-Access-Token': config.shopify.accessToken,
      },
      body: PRODUCTS_QUERY,
    },
  )
  if (!response.ok) throw new Error(response.statusText)

  const result: GraphQLResponse<ProductsQuery> = await response.json()

  if (result.errors != null) {
    result.errors.forEach(error => {
      console.error(error.message)
    })

    throw new Error('There was an error fetching the products.')
  }

  return result.data.products.edges.map(edge => edge.node)
}

export async function getCollections(): Promise<Collection[]> {
  const config = getConfig()
  const response = await fetch(
    `https://${config.shopify.storeName}.myshopify.com/api/2022-07/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/graphql',
        'X-Shopify-Storefront-Access-Token': config.shopify.accessToken,
      },
      body: COLLECTIONS_QUERY,
    },
  )
  if (!response.ok) throw new Error(response.statusText)

  const result: GraphQLResponse<CollectionsQuery> = await response.json()

  if (result.errors != null) {
    result.errors.forEach(error => {
      console.error(error.message)
    })

    throw new Error('There was an error fetching the collections.')
  }

  return result.data.collections.edges.map(edge => edge.node)
}

export async function getProduct(handle?: string): Promise<ProductFragment> {
  if (handle == null) return DEFAULT_PRODUCT

  const config = getConfig()
  const response = await fetch(
    `https://${config.shopify.storeName}.myshopify.com/api/2022-07/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': config.shopify.accessToken,
      },
      body: JSON.stringify({
        query: PRODUCT_QUERY,
        variables: { handle },
      }),
    },
  )
  if (!response.ok) throw new Error(response.statusText)

  const result: GraphQLResponse<ProductQuery> = await response.json()

  if (result.errors != null) {
    result.errors.forEach(error => {
      console.error(error.message)
    })

    throw new Error('There was an error fetching the product.')
  }

  return result.data.product
}
