import '../lib/makeswift/register-components'

import {
  getServerSideProps as makeswiftGetServerSideProps,
  PageProps as MakeswiftPageProps,
  Page as MakeswiftPage,
} from '@makeswift/runtime/next'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import { PageProps } from 'lib/types'
import { getProducts } from '../lib/bigcommerce'
import { ProductsContext } from 'lib/products-context'

type Props = MakeswiftPageProps & PageProps

export async function getServerSideProps(
  ctx: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> {
  const makeswiftResult = await makeswiftGetServerSideProps(ctx)

  if (!('props' in makeswiftResult)) return makeswiftResult

  const products = await getProducts()

  return {
    ...makeswiftResult,
    // @ts-ignore: `GetServerSidePropsResult['props']` is wrapped in a promise for some reason.
    props: { ...makeswiftResult.props, products },
  }
}

export default function Page({ products, ...restOfProps }: Props) {
  return (
    <ProductsContext.Provider value={products}>
      <MakeswiftPage {...restOfProps} />
    </ProductsContext.Provider>
  )
}
