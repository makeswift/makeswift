import { lazy } from 'react'

import {
  Checkbox,
  Combobox,
  Style,
  unstable_Cascade,
  TextInput,
  List,
  Color,
} from '@makeswift/runtime/controls'

import { runtime } from '@/makeswift/runtime'

type Category = { id: string; label: string }
type Product = {
  id: string
  label: string
  categoryId: string
  discounted: boolean
}

const categories: Category[] = [
  { id: 'shirts', label: 'Shirts' },
  { id: 'shoes', label: 'Shoes' },
]

const products: Product[] = [
  { id: 'p1', label: 'Classic Tee', categoryId: 'shirts', discounted: false },
  { id: 'p2', label: 'Clearance Tee', categoryId: 'shirts', discounted: true },
  { id: 'p3', label: 'Running Shoe', categoryId: 'shoes', discounted: false },
  {
    id: 'p4',
    label: 'Clearance Sandal',
    categoryId: 'shoes',
    discounted: true,
  },
]

async function categoryOptions(showDiscountsOnly: boolean) {
  const withProducts = categories.filter((category) =>
    products.some(
      (product) =>
        product.categoryId === category.id &&
        (!showDiscountsOnly || product.discounted),
    ),
  )
  return withProducts.map((category) => ({
    id: category.id,
    label: category.label,
    value: category,
  }))
}

async function productOptions(category: Category) {
  return products
    .filter((product) => product.categoryId === category.id)
    .map((product) => ({
      id: product.id,
      label: product.label,
      value: product,
    }))
}

runtime.registerComponent(
  lazy(() => import('./cascade-demo')),
  {
    type: 'Cascade Demo',
    label: 'Custom / Cascade Demo',
    props: {
      className: Style(),
      test: List({
        label: 'Texts',
        type: TextInput({ label: 'Text', defaultValue: 'Text Title' }),
        getItemLabel: (item) => item ?? 'Text',
      }),
      product: unstable_Cascade({
        label: 'Product',
        steps: [
          () => Checkbox({ label: 'Show discounts only' }),
          // // () =>
          // //   List({
          // //     label: 'Texts',
          // //     type: TextInput({ label: 'Text', defaultValue: 'Text Title' }),
          // //     getItemLabel: (item) => item ?? 'Text',
          // //   }),
          // () => Color({ label: 'Color' }),
          (showDiscounts: boolean) => {
            console.log({ showDiscounts })
            return Combobox({
              label: 'Category',
              getOptions: () => categoryOptions(true),
            })
          },
          (category: Category) =>
            Combobox({
              label: 'Product',
              getOptions: () => productOptions(category),
            }),
        ],
      }),
    },
  },
)
