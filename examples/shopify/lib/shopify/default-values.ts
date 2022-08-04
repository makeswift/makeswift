import { ProductFragment } from './types'

export const DEFAULT_PRODUCT: ProductFragment = {
  id: 'gid://shopify/Product/7815104332028',
  title: 'Monstera',
  description:
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a.Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci. Aenean dignissim pellentesque felis.',
  handle: 'monstera',
  featuredImage: {
    altText: '',
    url: 'https://cdn.shopify.com/s/files/1/0657/0498/4828/products/image_1.png?v=1660327909',
  },
  images: {
    edges: [
      {
        node: {
          altText: '',
          url: 'https://cdn.shopify.com/s/files/1/0657/0498/4828/products/image_1.png?v=1660327909',
        },
      },
    ],
  },
  priceRange: {
    minVariantPrice: {
      amount: '79.0',
      currencyCode: 'USD',
    },
  },
  collections: {
    edges: [
      {
        node: {
          id: 'gid://shopify/Collection/400226156796',
          title: 'Plants',
        },
      },
      {
        node: {
          id: 'gid://shopify/Collection/400226189564',
          title: 'All',
        },
      },
    ],
  },
}
