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
}

export type ProductsQuery = {
  products: {
    edges: {
      node: ProductFragment
    }[]
  }
}

export type ProductQuery = {
  product: ProductFragment
}
