export type StorefrontApiTokenResponse = { data: { token: string } }

export type GraphQLError = { message: string }

export type GraphQLResponse<T> =
  | { data: T; errors: undefined }
  | { data: null; errors: GraphQLError[] }

export type ResponseImage = {
  urlOriginal: string
  altText: string
}

export type Category = {
  entityId: number
  name: string
  path: string
}

export type CategoriesQuery = {
  site: {
    categoryTree: Category[]
  }
}

export type ProductFragment = {
  entityId: number
  name: string
  description: string
  defaultImage: ResponseImage
  images: {
    edges: {
      node: ResponseImage
    }[]
  }
  prices: {
    price: {
      value: number
      currencyCode: string
    }
  }
  categories: {
    edges: {
      node: Category
    }[]
  }
}

export type ProductsQuery = {
  site: {
    products: {
      edges: {
        node: ProductFragment
      }[]
    }
  }
}

export type ProductQuery = {
  site: {
    products: {
      edges: {
        node: ProductFragment
      }[]
    }
  }
}
