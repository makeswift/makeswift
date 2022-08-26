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
    variants(first: 1) {
      edges {
        node {
          id
          title
          unitPrice {
            amount
            currencyCode
          }
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

export const CART_LINE_FRAGMENT = /* GraphQL */ `
  fragment CartLine on CartLine {
    id
    quantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        image {
          altText
          url
        }
        product {
          title
          handle
        }
      }
    }
  }
`

export const CART_FRAGMENT = /* GraphQL */ `
  fragment Cart on Cart {
    id
    lines(first: 100) {
      edges {
        node {
          ...CartLine
        }
      }
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
    }
  }

  ${CART_LINE_FRAGMENT}
`

export const CART_QUERY = /* GraphQL */ `
  query CART($id: ID!) {
    cart(id: $id) {
      ...Cart
    }
  }

  ${CART_FRAGMENT}
`

export const CREATE_CART_MUTATION = /* GraphQL */ `
  mutation CartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        ...Cart
      }
    }
  }

  ${CART_FRAGMENT}
`

export const ADD_LINES_MUTATION = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...Cart
      }
    }
  }

  ${CART_FRAGMENT}
`

export const UPDATE_LINES_MUTATION = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...Cart
      }
    }
  }

  ${CART_FRAGMENT}
`

export const REMOVE_LINES_MUTATION = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...Cart
      }
    }
  }

  ${CART_FRAGMENT}
`

export const CHECKOUT_QUERY = /* GraphQL */ `
  query checkoutURL($cartId: ID!) {
    cart(id: $cartId) {
      checkoutUrl
    }
  }
`
