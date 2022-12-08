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
    spanishTranslations: metafields(namespace: "es", keys: ["name", "description"]) {
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
  query Products {
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
  query Product($entityId: Int!) {
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
