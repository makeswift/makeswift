export type GraphQLError = { message: string }

export type GraphQLResponse<T> =
  | { data: T; errors: undefined }
  | { data: null; errors: GraphQLError[] }

export type RestResponse<T> = {
  data: T
  errors: undefined
}

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
  spanishTranslations: {
    edges: { node: { key: string; value: string } }[]
  }
}

export type TranslatedProductFragment = Omit<ProductFragment, 'spanishTranslations'>

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

export type LineItemRequest = {
  id?: string
  product_id: number
  quantity: number
  name: string
  image_url: string
  original_price: number
}

export type LineItemResponse = {
  id: string
  product_id: number
  quantity: number
  parent_id: string
  variant_id: number
  sku: string
  name: string
  url: string
  taxable: boolean
  image_url: string
  discounts: []
  coupons: []
  discount_amount: number
  coupon_amount: number
  original_price: number
  list_price: number
  sale_price: number
  extended_list_price: number
  extended_sale_price: number
  is_require_shipping: boolean
  is_mutable: boolean
}

export type CartResponse = {
  id: string
  customer_id: number
  channel_id: number
  email: string
  currency: {
    code: string
  }
  tax_included: string
  base_amount: number
  discount_amount: number
  cart_amount: number
  coupons: []
  line_items: {
    physical_items: LineItemRequest[]
    digital_items: []
    gift_certificates: []
    custom_items: []
  }
  created_time: string
  updated_time: string
  locale: string
}

export type RedirectURLResponse = {
  cart_url: string
  checkout_url: string
  embedded_checkout_url: string
}
