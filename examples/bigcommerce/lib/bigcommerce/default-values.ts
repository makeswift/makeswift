import { CartResponse, ProductFragment } from './types'

export const DEFAULT_PRODUCT: ProductFragment = {
  entityId: 112,
  name: 'Monsterra',
  description:
    '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a.  Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci. Aenean dignissim pellentesque felis.</p>',
  defaultImage: {
    urlOriginal:
      'https://cdn11.bigcommerce.com/s-5yjdhtv55p/images/stencil/original/products/112/376/plant-1__92670.1704473318.jpg',
    altText: 'Monsterra Plant',
  },
  images: {
    edges: [
      {
        node: {
          urlOriginal:
            'https://cdn11.bigcommerce.com/s-5yjdhtv55p/images/stencil/original/products/112/376/plant-1__92670.1704473318.jpg',
          altText: 'Monsterra Plant',
        },
      },
    ],
  },
  prices: {
    price: {
      value: 50.0,
      currencyCode: 'USD',
    },
  },

  categories: {
    edges: [
      {
        node: {
          entityId: 25,
          name: 'Plants',
          path: '/plants/',
        },
      },
      {
        node: {
          entityId: 24,
          name: 'All Products',
          path: '/all-products/',
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
      {
        node: {
          key: 'description',
          value:
            '<p>Es importante tener un buen servicio al cliente, un proveedor de servicio al cliente. Hasta que lo odio. La vida de todos se gasta en bienes raíces. Nadie esperaba que fuera feo. Nibh de urna suspendida, no tirada, siempre toma, pone un. \\n Hasta que no solo necesita desencadenar una fácil fermentación. Algunas de las aerolíneas más importantes son médicas. Aenean dignissim pellentesque felis.</p>',
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
