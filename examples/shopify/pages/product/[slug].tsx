import '../../lib/makeswift/register-components'

import {
  PageProps as MakeswiftPageProps,
  Page as MakeswiftPage,
  Makeswift,
} from '@makeswift/runtime/next'
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'

import { getProduct, getProducts } from 'lib/shopify'
import { getConfig } from 'lib/config'
import { ProductPageProps } from 'lib/types'
import { ProductsContext } from 'lib/products-context'
import { ProductContext } from 'lib/product-context'

type Props = MakeswiftPageProps & ProductPageProps

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const products = await getProducts()

  return {
    paths: products.map(product => ({
      params: { slug: product.handle },
    })),
    fallback: 'blocking',
  }
}

export async function getStaticProps(
  ctx: GetStaticPropsContext,
): Promise<GetStaticPropsResult<Props>> {
  const config = getConfig()
  const makeswift = new Makeswift(config.makeswift.siteApiKey)

  const snapshot = await makeswift.getPageSnapshot(config.makeswift.productTemplatePathname, {
    preview: ctx.preview,
  })

  if (snapshot == null) return { notFound: true, revalidate: 1 }

  const slug = ctx.params?.slug

  if (slug == null) throw new Error('"slug" URL parameter must be defined.')

  const products = await getProducts()
  const product = await getProduct(slug.toString())

  if (product == null) return { notFound: true, revalidate: 1 }

  return {
    props: { snapshot, products, product },
    revalidate: 1,
  }
}

export default function Page({ products, product, snapshot }: Props) {
  return (
    <ProductsContext.Provider value={products}>
      <ProductContext.Provider value={product}>
        <MakeswiftPage snapshot={snapshot} />
      </ProductContext.Provider>
    </ProductsContext.Provider>
  )
}
