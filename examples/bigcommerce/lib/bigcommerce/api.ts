import { getConfig } from '../config'
import { CATEGORY_QUERY, PRODUCTS_QUERY, PRODUCT_QUERY } from './graphql'
import {
  CartResponse,
  CategoriesQuery,
  Category,
  GraphQLResponse,
  LineItemRequest,
  ProductFragment,
  ProductQuery,
  RedirectURLResponse,
  RestResponse,
} from './types'

export async function getProducts(): Promise<ProductFragment[]> {
  const config = getConfig()
  const response = await fetch(config.bigcommerce.storefrontURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + config.bigcommerce.storefrontToken,
    },
    body: JSON.stringify({
      query: PRODUCTS_QUERY,
    }),
  })

  if (!response.ok) throw new Error(response.statusText)

  const result: GraphQLResponse<ProductQuery> = await response.json()

  if (result.errors != null) {
    result.errors.forEach(error => {
      console.error(error.message)
    })

    throw new Error('There was an error fetching the products.')
  }

  return result.data.site.products.edges.map(edge => edge.node)
}

export async function getCategories(): Promise<Category[]> {
  const config = await getConfig()
  const response = await fetch(config.bigcommerce.storefrontURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + config.bigcommerce.storefrontToken,
    },
    body: JSON.stringify({ query: CATEGORY_QUERY }),
  })

  if (!response.ok) throw new Error(response.statusText)

  const result: GraphQLResponse<CategoriesQuery> = await response.json()

  if (result.errors != null) {
    result.errors.forEach(error => {
      console.error(error.message)
    })

    throw new Error('There was an error fetching the categories.')
  }

  return result.data.site.categoryTree
}

export async function getProduct(id: number): Promise<ProductFragment | null> {
  const config = getConfig()
  const response = await fetch(config.bigcommerce.storefrontURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + config.bigcommerce.storefrontToken,
    },
    body: JSON.stringify({
      query: PRODUCT_QUERY,
      variables: { entityId: id },
    }),
  })

  if (!response.ok) throw new Error(response.statusText)

  const result: GraphQLResponse<ProductQuery> = await response.json()

  if (result.errors != null) {
    result.errors.forEach(error => {
      console.error(error.message)
    })

    throw new Error('There was an error fetching the product.')
  }

  const [productEdge] = result.data.site.products.edges

  return productEdge.node
}

export async function attemptGetCart(cartId: string): Promise<CartResponse | null> {
  try {
    const response = await fetch(`/api/cart?cartId=${cartId}`)
    const result: RestResponse<CartResponse> = await response.json()
    return result.data
  } catch {
    return null
  }
}
export async function createCart(): Promise<CartResponse> {
  const response = await fetch(`/api/cart`, {
    method: 'POST',
    body: JSON.stringify(null),
  })
  const result: RestResponse<CartResponse> = await response.json()
  return result.data
}

export async function addLineItem(
  cart: CartResponse | null,
  lineItem: LineItemRequest,
): Promise<CartResponse> {
  const response = await fetch(`/api/cart${cart ? `?cartId=${cart.id}` : ''}`, {
    method: 'POST',
    body: JSON.stringify({
      line_item: lineItem,
    }),
  })
  const result: RestResponse<CartResponse> = await response.json()
  return result.data
}

export async function updateLineItem(
  cart: CartResponse,
  productId: number,
  lineItem: LineItemRequest,
): Promise<CartResponse> {
  const relatedLineItem = cart?.line_items.physical_items.find(
    lineItem => lineItem.product_id === productId,
  )
  if (!relatedLineItem) return cart
  const response = await fetch(`/api/cart?cartId=${cart.id}&lineItemId=${relatedLineItem.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      line_item: lineItem,
    }),
  })
  const result: RestResponse<CartResponse> = await response.json()
  return result.data
}

export async function deleteLineItem(cart: CartResponse, productId: number): Promise<CartResponse> {
  const relatedLineItem = cart?.line_items.physical_items.find(
    lineItem => lineItem.product_id === productId,
  )
  if (!relatedLineItem) return cart
  const response = await fetch(`/api/cart?cartId=${cart.id}&lineItemId=${relatedLineItem.id}`, {
    method: 'DELETE',
  })
  const result: RestResponse<CartResponse> = await response.json()
  return result.data
}

export async function getCheckoutURL(cart: CartResponse | null): Promise<string | null> {
  if (!cart) return null
  try {
    const response = await fetch(`/api/checkout?cartId=${cart.id}`)
    const result: RestResponse<RedirectURLResponse> = await response.json()
    return result.data.checkout_url
  } catch (e) {
    console.error(`There was an error requesting a Checkout URL`, e)
    return null
  }
}
