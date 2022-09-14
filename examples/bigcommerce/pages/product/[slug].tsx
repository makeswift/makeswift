import '../../lib/makeswift/register-components'

import {
  getStaticProps as makeswiftGetStaticProps,
  PageProps as MakeswiftPageProps,
  Page as MakeswiftPage,
} from '@makeswift/runtime/next'
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'

import { getProduct, getProducts } from 'lib/bigcommerce'
import { getConfig } from 'lib/config'
import { ProductPageProps } from 'lib/types'
import { ProductsContext } from 'lib/products-context'
import { ProductContext } from 'lib/product-context'

type Props = MakeswiftPageProps & ProductPageProps

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const products = await getProducts()

  return {
    paths: products.map(product => ({ params: { slug: product.entityId.toString() } })),
    fallback: 'blocking',
  }
}

export async function getStaticProps(
  ctx: GetStaticPropsContext,
): Promise<GetStaticPropsResult<Props>> {
  const config = getConfig()
  const makeswiftResult = await makeswiftGetStaticProps({
    ...ctx,
    params: {
      ...ctx.params,
      path: config.makeswift.productTemplatePathname.replace(/^\//, '').split('/'),
    },
  })

  if (!('props' in makeswiftResult)) return makeswiftResult

  const slug = ctx.params?.slug

  if (slug == null) throw new Error('"slug" URL parameter must be defined.')

  const products = await getProducts()
  const product = await getProduct(Number.parseInt(slug.toString(), 10))

  if (product == null) return { notFound: true }

  return { ...makeswiftResult, props: { ...makeswiftResult.props, products, product } }
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
