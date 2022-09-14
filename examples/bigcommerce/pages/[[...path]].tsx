import '../lib/makeswift/register-components'

import {
  getStaticProps as makeswiftGetStaticProps,
  PageProps as MakeswiftPageProps,
  Page as MakeswiftPage,
} from '@makeswift/runtime/next'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'

import { getProducts } from 'lib/bigcommerce'
import { PageProps } from 'lib/types'
import { ProductsContext } from 'lib/products-context'

type Props = MakeswiftPageProps & PageProps

export async function getStaticProps(
  ctx: GetStaticPropsContext<{ path: string[] }>,
): Promise<GetStaticPropsResult<Props>> {
  const makeswiftResult = await makeswiftGetStaticProps(ctx)

  if (!('props' in makeswiftResult)) return makeswiftResult

  const products = await getProducts()

  return { ...makeswiftResult, props: { ...makeswiftResult.props, products } }
}

export default function Page({ products, ...restOfProps }: Props) {
  return (
    <ProductsContext.Provider value={products}>
      <MakeswiftPage {...restOfProps} />
    </ProductsContext.Provider>
  )
}

export { getStaticPaths } from '@makeswift/runtime/next'
