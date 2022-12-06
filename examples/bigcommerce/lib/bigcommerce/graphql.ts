export const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment Product on Product {
    entityId
    name
    description
    defaultImage {
      urlOriginal
      altText
    }
    images {
      edges {
        node {
          urlOriginal
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
    categories {
      edges {
        node {
          entityId
          name
          path
        }
      }
    }
    localeMeta: metafields(namespace: $locale, keys: ["name", "description"])
      @include(if: $hasLocale) {
      edges {
        node {
          key
          value
        }
      }
    }
  }
`

export const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($hasLocale: Boolean = false, $locale: String = "null") {
    site {
      products(first: 20) {
        edges {
          node {
            ...Product
          }
        }
      }
    }
  }

  ${PRODUCT_FRAGMENT}
`

export const PRODUCT_QUERY = /* GraphQL */ `
  query Product($entityId: Int!, $hasLocale: Boolean = false, $locale: String = "null") {
    site {
      products(entityIds: [$entityId]) {
        edges {
          node {
            ...Product
          }
        }
      }
    }
  }

  ${PRODUCT_FRAGMENT}
`

export const CATEGORY_QUERY = /* GraphQL */ `
  query Categories {
    site {
      categoryTree {
        entityId
        name
        path
      }
    }
  }
`
