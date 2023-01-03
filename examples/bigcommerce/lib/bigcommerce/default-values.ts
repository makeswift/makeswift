import { CartResponse, ProductFragment } from './types'

export const DEFAULT_PRODUCT: ProductFragment = {
  entityId: 113,
  name: 'Monstera',
  description:
    '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a.  Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci. Aenean dignissim pellentesque felis.</p>',
  defaultImage: {
    urlOriginal:
      'https://cdn11.bigcommerce.com/s-uvhswop3wh/images/stencil/original/products/113/396/image_2__07829.1660659630.png',
    altText: 'monstera plant',
  },
  images: {
    edges: [
      {
        node: {
          urlOriginal:
            'https://cdn11.bigcommerce.com/s-uvhswop3wh/images/stencil/original/products/113/396/image_2__07829.1660659630.png',
          altText: 'monstera plant',
        },
      },
    ],
  },
  prices: {
    price: {
      value: 79,
      currencyCode: 'USD',
    },
  },
  categories: {
    edges: [
      {
        node: {
          entityId: 23,
          name: 'Shop All',
          path: '/shop-all/',
        },
      },
      {
        node: {
          entityId: 24,
          name: 'Plants',
          path: '/plants/',
        },
      },
    ],
  },
  spanishTranslations: {
    edges: [
      {
        node: {
          key: 'name',
          value: 'Monstera',
        },
      },
    ],
  },
}

export const DEFAULT_CART: CartResponse = {
  id: '50d74e46-d8b8-4a0b-8d9c-833aefd59f41',
  customer_id: 0,
  channel_id: 1,
  email: '',
  currency: { code: 'USD' },
  tax_included: 'false',
  base_amount: 0,
  discount_amount: 0,
  cart_amount: 0,
  coupons: [],
  line_items: {
    physical_items: [],
    digital_items: [],
    gift_certificates: [],
    custom_items: [],
  },
  created_time: '2023-01-03T20:25:08+00:00',
  updated_time: '2023-01-03T20:25:09+00:00',
  locale: 'en',
}
