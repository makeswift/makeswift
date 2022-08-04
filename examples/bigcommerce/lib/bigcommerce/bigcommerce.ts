const DEFAULT_PRODUCT_ID = 77

const shopName = process.env.STORE_NAME
const bigcommerceAccessToken = process.env.ACCESS_TOKEN

const getBearerToken = async () => {
  const twentyThirtyInSeconds = 1912037490

  const response = await fetch(
    `https://api.bigcommerce.com/stores/${process.env.STORE_HASH}/v3/storefront/api-token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': process.env.ACCESS_TOKEN,
      },
      body: JSON.stringify({
        channel_id: 1,
        expires_at: twentyThirtyInSeconds,
        allowed_cors_origins: ['https://makeswift-example.mybigcommerce.com'],
      }),
    },
  ).then(a => a.json())
  return response
}

export async function getProducts() {
  if (shopName == null) {
    throw new Error('SHOPIFY_SHOP env variable is needed')
  }

  if (bigcommerceAccessToken == null) {
    throw new Error('SHOPIFY_STOREFRONT_ACCESS_TOKEN env variable is needed')
  }

  const bearerTokenResponse = await getBearerToken()

  if (bearerTokenResponse.errors) {
    console.error(bearerTokenResponse.errors)
    throw new Error('Error while getting access token')
  }

  const response = await fetch(`https://${shopName}.mybigcommerce.com/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + bearerTokenResponse.data.token,
    },
    body: JSON.stringify({
      query: `
      query paginateProducts {
        site {
          products (first: 9) {
            pageInfo {
              startCursor
              endCursor
              hasNextPage
              hasPreviousPage
            }
            edges {
              cursor
              node {
                entityId
                name
                defaultImage {
                  url(width:400)
                  
                  altText
                }
                images {
                  
                  edges {
                    node {
                      url(width:400)
                      altText
                    }
                  }
                }
                prices {
                  retailPrice {
                    value
                    currencyCode
                  }
                  price {
                    value
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
        `,
    }),
  }).then(a => a.json())

  if (response.errors) {
    console.error(response.errors)
    throw new Error('Error while fetching products')
  }

  return response.data.site.products.edges
}

export async function getProduct(id = DEFAULT_PRODUCT_ID) {
  if (shopName == null) {
    throw new Error('SHOPIFY_SHOP env variable is needed')
  }

  if (bigcommerceAccessToken == null) {
    throw new Error('SHOPIFY_STOREFRONT_ACCESS_TOKEN env variable is needed')
  }

  const bearerTokenResponse = await getBearerToken()

  if (bearerTokenResponse.errors) {
    console.error(bearerTokenResponse.errors)
    throw new Error('Error while getting access token')
  }

  const response = await fetch('https://makeswift-example.mybigcommerce.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + bearerTokenResponse.data.token,
    },
    body: JSON.stringify({
      query: `
      query SingleProduct (
        $entityId: Int!
      ){
        site {
          products (entityIds: [$entityId]) {
            edges {
              node {
                id
                entityId
                name
                defaultImage {
                  url(width:400)
                  altText
                }
                images {
                  edges {
                    node {
                      url(width:400)
                      altText
                    }
                  }
                }
                prices {
                  price {
                    value
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
      
        `,
      variables: {
        entityId: id,
      },
    }),
  }).then(a => a.json())

  if (response.errors) {
    console.error(response.errors)
    throw new Error(`Error while fetching product ${id}`)
  }

  return response.data.site.products.edges[0].node
}
