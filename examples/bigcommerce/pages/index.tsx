import '../lib/makeswift/register-components'

import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import {
  getStaticProps as makeswiftGetStaticProps,
  PageProps as MakeswiftPageProps,
  Page as MakeswiftPage,
} from '@makeswift/runtime/next'

import { getProducts } from '../lib/bigcommerce/bigcommerce'
import { ProductsContext } from '../lib/makeswift/context'

type Props = MakeswiftPageProps & {
  products: any
}

export async function getStaticProps(
  ctx: GetStaticPropsContext,
): Promise<GetStaticPropsResult<Props>> {
  // Map any version of this page to the __post__ url in Makeswift
  const makeswiftResult = await makeswiftGetStaticProps({
    ...ctx,
    params: { ...ctx.params, path: [''] },
  })
  const products = await getProducts()
  if (!products) return { notFound: true }

  // @ts-ignore
  return {
    ...makeswiftResult,
    // @ts-ignore
    props: { ...makeswiftResult.props, products },
    revalidate: 300,
  }
}

export default function Page({ products, ...restOfProps }: Props) {
  if (!products) return

  return (
    <ProductsContext.Provider value={products}>
      <MakeswiftPage {...restOfProps} />;
    </ProductsContext.Provider>
  )
}
