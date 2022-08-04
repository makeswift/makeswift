export const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment Product on Product {
    id
    title
    description
    handle
    featuredImage {
      altText
      url
    }
    images(first: 10) {
      edges {
        node {
          altText
          url
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    collections(first: 10) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`

export const PRODUCTS_QUERY = /* GraphQL */ `
  query Products {
    products(first: 20) {
      edges {
        node {
          ...Product
        }
      }
    }
  }

  ${PRODUCT_FRAGMENT}
`

export const PRODUCT_QUERY = /* GraphQL */ `
  query Product($handle: String!) {
    product(handle: $handle) {
      ...Product
    }
  }

  ${PRODUCT_FRAGMENT}
`

export const COLLECTIONS_QUERY = /* GraphQL */ `
  query Collections {
    collections(first: 20) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`
