import { getConfig } from '../config'
import { CATEGORY_QUERY, PRODUCTS_QUERY, PRODUCT_QUERY } from './graphql'
import { CategoriesQuery, Category, GraphQLResponse, ProductFragment, ProductQuery } from './types'

export async function getProducts({ locale }: { locale?: string } = {}): Promise<
  ProductFragment[]
> {
  const config = getConfig()
  const response = await fetch(config.bigcommerce.storefrontURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + config.bigcommerce.storefrontToken,
    },
    body: JSON.stringify({
      query: PRODUCTS_QUERY,
      variables: { hasLocale: locale != null, locale },
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

  return result.data.site.products.edges.map(edge => {
    const localeSpecificProductData =
      edge.node.localeMeta?.edges.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.node.key]: curr.node.value,
        }),
        {},
      ) ?? {}

    return { ...edge.node, ...localeSpecificProductData }
  })
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

export async function getProduct(
  id: number,
  { locale }: { locale?: string } = {},
): Promise<ProductFragment | null> {
  const config = getConfig()
  const response = await fetch(config.bigcommerce.storefrontURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + config.bigcommerce.storefrontToken,
    },
    body: JSON.stringify({
      query: PRODUCT_QUERY,
      variables: { entityId: id, hasLocale: locale != null, locale },
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
  const localeSpecificProductData =
    productEdge.node.localeMeta?.edges.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.node.key]: curr.node.value,
      }),
      {},
    ) ?? {}

  return { ...productEdge.node, ...localeSpecificProductData }
}
