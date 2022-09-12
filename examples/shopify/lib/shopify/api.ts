import { getConfig, getPublicConfig } from '../config'
import { DEFAULT_PRODUCT } from './default-values'
import {
  ADD_LINES_MUTATION,
  CART_QUERY,
  CHECKOUT_QUERY,
  COLLECTIONS_QUERY,
  CREATE_CART_MUTATION,
  PRODUCTS_QUERY,
  PRODUCT_QUERY,
  REMOVE_LINES_MUTATION,
  UPDATE_LINES_MUTATION,
} from './graphql'
import {
  CartFragment,
  Collection,
  CollectionsQuery,
  GraphQLResponse,
  CartLineInput,
  ProductFragment,
  ProductQuery,
  ProductsQuery,
  CartLineUpdateInput,
  CheckoutURLQuery,
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

export async function getProduct(handle: string): Promise<ProductFragment | null> {
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

    throw new Error(`There was an error fetching the product with handle "${handle}"`)
  }

  return result.data.product
}

export async function getCart(id: string): Promise<CartFragment> {
  const config = getPublicConfig()
  const response = await fetch(
    `https://${config.shopify.storeName}.myshopify.com/api/2022-07/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': config.shopify.accessToken,
      },
      body: JSON.stringify({
        query: CART_QUERY,
        variables: {
          id,
        },
      }),
    },
  )
  if (!response.ok) throw new Error(response.statusText)

  const result: GraphQLResponse<{ cart: CartFragment }> = await response.json()

  if (result.errors != null) {
    result.errors.forEach(error => {
      console.error(error.message)
    })

    throw new Error(`There was an error fetching cart with id "${id}".`)
  }

  return result.data.cart
}

export async function createCart(lines: CartLineInput[]): Promise<CartFragment> {
  const config = getPublicConfig()
  const response = await fetch(
    `https://${config.shopify.storeName}.myshopify.com/api/2022-07/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': config.shopify.accessToken,
      },
      body: JSON.stringify({
        query: CREATE_CART_MUTATION,
        variables: {
          input: {
            lines,
          },
        },
      }),
    },
  )
  if (!response.ok) throw new Error(response.statusText)

  const result: GraphQLResponse<{ cartCreate: { cart: CartFragment } }> = await response.json()

  if (result.errors != null) {
    result.errors.forEach(error => {
      console.error(error.message)
    })

    throw new Error('There was an error creating a cart.')
  }

  return result.data.cartCreate.cart
}

export async function addLines(cartId: string, lines: CartLineInput[]): Promise<CartFragment> {
  const config = getPublicConfig()
  const response = await fetch(
    `https://${config.shopify.storeName}.myshopify.com/api/2022-07/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': config.shopify.accessToken,
      },
      body: JSON.stringify({
        query: ADD_LINES_MUTATION,
        variables: {
          cartId,
          lines,
        },
      }),
    },
  )
  if (!response.ok) throw new Error(response.statusText)

  const result: GraphQLResponse<{
    cartLinesAdd: { cart: CartFragment }
  }> = await response.json()

  if (result.errors != null) {
    result.errors.forEach(error => {
      console.error(error.message)
    })

    throw new Error('There was an error adding lines to cart')
  }

  return result.data.cartLinesAdd.cart
}

export async function updateLines(
  cartId: string,
  lines: CartLineUpdateInput[],
): Promise<CartFragment> {
  const config = getPublicConfig()
  const response = await fetch(
    `https://${config.shopify.storeName}.myshopify.com/api/2022-07/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': config.shopify.accessToken,
      },
      body: JSON.stringify({
        query: UPDATE_LINES_MUTATION,
        variables: {
          cartId,
          lines,
        },
      }),
    },
  )
  if (!response.ok) throw new Error(response.statusText)

  const result: GraphQLResponse<{
    cartLinesUpdate: { cart: CartFragment }
  }> = await response.json()

  if (result.errors != null) {
    result.errors.forEach(error => {
      console.error(error.message)
    })

    throw new Error('There was an error updating lines in cart')
  }

  return result.data.cartLinesUpdate.cart
}

export async function removeLines(cartId: string, lineIds: string[]): Promise<CartFragment> {
  const config = getPublicConfig()
  const response = await fetch(
    `https://${config.shopify.storeName}.myshopify.com/api/2022-07/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': config.shopify.accessToken,
      },
      body: JSON.stringify({
        query: REMOVE_LINES_MUTATION,
        variables: {
          cartId,
          lineIds,
        },
      }),
    },
  )
  if (!response.ok) throw new Error(response.statusText)

  const result: GraphQLResponse<{
    cartLinesRemove: { cart: CartFragment }
  }> = await response.json()

  if (result.errors != null) {
    result.errors.forEach(error => {
      console.error(error.message)
    })

    throw new Error('There was an error removing lines from cart.')
  }

  return result.data.cartLinesRemove.cart
}

export async function getCheckoutUrl(cartId: string): Promise<string> {
  const config = getPublicConfig()
  const response = await fetch(
    `https://${config.shopify.storeName}.myshopify.com/api/2022-07/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': config.shopify.accessToken,
      },
      body: JSON.stringify({
        query: CHECKOUT_QUERY,
        variables: {
          cartId,
        },
      }),
    },
  )
  if (!response.ok) throw new Error(response.statusText)

  const result: GraphQLResponse<CheckoutURLQuery> = await response.json()

  if (result.errors != null) {
    result.errors.forEach(error => {
      console.error(error.message)
    })

    throw new Error('There was an error fetching checkoutUrl')
  }

  return result.data.cart.checkoutUrl
}
