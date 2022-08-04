import { Style } from '@makeswift/runtime/controls'
import { ReactRuntime } from '@makeswift/runtime/react'
import ProductDetail from '../productDetail'
import ProductList from '../productList'

import { ProductsContext, ProductContext } from './context'

ReactRuntime.registerComponent(ProductList, {
  type: 'product-list',
  label: 'Product List',
  props: {
    className: Style({ properties: Style.All }),
  },
})

ReactRuntime.registerComponent(ProductDetail, {
  type: 'product-detail',
  label: 'Product Detail',
  props: {
    className: Style({ properties: Style.All }),
  },
})
