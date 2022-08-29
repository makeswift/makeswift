import { Combobox, Link, List, Number, Shape, Style, TextInput } from '@makeswift/runtime/controls'
import { ReactRuntime } from '@makeswift/runtime/react'

import {
  ProductList,
  ProductImages,
  Header,
  ProductAddToCartButton,
  ProductBreadcrumbs,
  ProductDescription,
  ProductName,
  ProductPrice,
} from 'components'
import { Category } from 'lib/bigcommerce'

ReactRuntime.registerComponent(ProductList, {
  type: 'product-list',
  label: 'Product list',
  props: {
    className: Style({ properties: Style.All }),
    categoryEntityId: Combobox({
      async getOptions() {
        return fetch(`/api/categories`)
          .then(r => r.json())
          .then((categories: Category[]) =>
            categories.map(category => ({
              id: category.entityId.toString(),
              label: category.name,
              value: category.entityId.toString(),
            })),
          )
      },
      label: 'Category',
    }),
    count: Number({
      label: 'Count',
      defaultValue: 4,
      max: 8,
      min: 1,
      labelOrientation: 'horizontal',
      step: 1,
    }),
  },
})

ReactRuntime.registerComponent(ProductImages, {
  type: 'product-images',
  label: 'Product images',
  props: {
    className: Style({ properties: Style.All }),
  },
})

ReactRuntime.registerComponent(ProductPrice, {
  type: 'product-price',
  label: 'Product price',
  props: {
    className: Style({ properties: Style.All }),
  },
})

ReactRuntime.registerComponent(ProductBreadcrumbs, {
  type: 'product-breadcrumbs',
  label: 'Product breadcrumbs',
  props: {
    className: Style({ properties: [Style.Margin, Style.Width] }),
  },
})

ReactRuntime.registerComponent(ProductName, {
  type: 'product-name',
  label: 'Product name',
  props: {
    className: Style({ properties: Style.All }),
  },
})

ReactRuntime.registerComponent(ProductDescription, {
  type: 'product-description',
  label: 'Product description',
  props: {
    className: Style({ properties: Style.All }),
  },
})

ReactRuntime.registerComponent(Header, {
  type: 'header',
  label: 'Header',
  props: {
    className: Style({ properties: Style.All }),
    links: List({
      type: Shape({
        type: {
          link: Link(),
          text: TextInput({ label: 'Text' }),
        },
      }),
      label: 'Links',
      getItemLabel: item => item?.text ?? '',
    }),
  },
})

ReactRuntime.registerComponent(ProductAddToCartButton, {
  type: 'add-to-cart-button',
  label: 'Add to cart button',
  props: {
    className: Style({ properties: [Style.Margin] }),
  },
})
