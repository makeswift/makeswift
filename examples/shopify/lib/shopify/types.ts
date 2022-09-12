export type GraphQLError = { message: string }

export type GraphQLResponse<T> =
  | { data: T; errors: undefined }
  | { data: null; errors: GraphQLError[] }

export type ResponseImage = {
  altText: string
  url: string
}

export type Collection = {
  id: string
  title: string
}

export type CollectionsQuery = {
  collections: {
    edges: {
      node: Collection
    }[]
  }
}

export type ProductFragment = {
  id: string
  title: string
  description: string
  handle: string
  featuredImage: ResponseImage
  images: {
    edges: {
      node: ResponseImage
    }[]
  }
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  collections: {
    edges: {
      node: Collection
    }[]
  }
  variants: {
    edges: {
      node: {
        id: string
        title: string
        unitPrice: {
          amount: string
          currencyCode: string
        }
      }
    }[]
  }
}

export type ProductsQuery = {
  products: {
    edges: {
      node: ProductFragment
    }[]
  }
}

export type ProductQuery = {
  product: ProductFragment | null
}

export type CartLineFragment = {
  id: string
  quantity: number
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
  }
  merchandise: {
    id: string
    image: {
      altText: string
      url: string
    }
    product: {
      title: string
      handle: string
    }
  }
}

export type CartFragment = {
  id: string
  lines: {
    edges: {
      node: CartLineFragment
    }[]
  }
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
  }
}

export type CartLineInput = {
  merchandiseId: string
  quantity: number
}

export type CartLineUpdateInput = {
  id: string
  quantity: number
}

export type CheckoutURLQuery = {
  cart: {
    checkoutUrl: string
  }
}
