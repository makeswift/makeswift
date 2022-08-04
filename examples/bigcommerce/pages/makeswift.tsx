import '../lib/makeswift/register-components'

import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import {
  getServerSideProps as makeswiftGetServerSideProps,
  PageProps as MakeswiftPageProps,
  Page as MakeswiftPage,
} from '@makeswift/runtime/next'
import { ProductsContext, ProductContext } from '../lib/makeswift/context'
import { getProduct, getProducts } from '../lib/bigcommerce/bigcommerce'

type Props = MakeswiftPageProps & {
  products: any
  product: any
}

export async function getServerSideProps(
  ctx: GetStaticPropsContext,
): Promise<GetStaticPropsResult<Props>> {
  // @ts-ignore
  const makeswiftResult = await makeswiftGetServerSideProps(ctx)

  const products = await getProducts()
  const product = await getProduct()

  return {
    ...makeswiftResult,
    props: {
      // @ts-ignore
      ...makeswiftResult.props,
      products,
      product,
    },
  }
}

export default function Page({ products, product, ...restOfProps }: Props) {
  return (
    <ProductsContext.Provider value={products}>
      <ProductContext.Provider value={product}>
        <MakeswiftPage {...restOfProps} />
      </ProductContext.Provider>
    </ProductsContext.Provider>
  )
}
